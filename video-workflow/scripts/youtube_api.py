"""Official Google clients, protected local OAuth, and resumable upload state."""
from __future__ import annotations

import ctypes
import json
import logging
import os
from pathlib import Path
import re
import tempfile

from channel import WORKSPACE, ROOT, moment, now, timestamp

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl",
          "https://www.googleapis.com/auth/yt-analytics.readonly"]
STATE = Path(os.environ.get("LOCALAPPDATA", Path.home() / ".local/share")) / "HyperframesChannel"


def protect(data, decrypt=False):
    if os.name != "nt":
        return data

    class Blob(ctypes.Structure):
        _fields_ = [("size", ctypes.c_ulong), ("data", ctypes.POINTER(ctypes.c_ubyte))]

    buffer = ctypes.create_string_buffer(data)
    source = Blob(len(data), ctypes.cast(buffer, ctypes.POINTER(ctypes.c_ubyte)))
    target = Blob()
    crypt = ctypes.windll.crypt32.CryptUnprotectData if decrypt else ctypes.windll.crypt32.CryptProtectData
    if not crypt(ctypes.byref(source), None, None, None, None, 1, ctypes.byref(target)):
        raise OSError("Windows could not protect/unprotect the credential store")
    try:
        return ctypes.string_at(target.data, target.size)
    finally:
        ctypes.windll.kernel32.LocalFree(target.data)


def secret_path(name):
    root = STATE.resolve()
    if root.is_relative_to(WORKSPACE.resolve()):
        raise ValueError("Credential storage must be outside the repository")
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    if os.name != "nt":
        root.chmod(0o700)
    if not re.fullmatch(r"[a-z0-9-]+", name):
        raise ValueError("Invalid credential record name")
    return root / (name + ".secret")


def save_secret(name, value):
    path = secret_path(name)
    payload = protect(json.dumps(value).encode())
    descriptor, temporary = tempfile.mkstemp(dir=path.parent)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(payload)
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def load_secret(name):
    path = secret_path(name)
    return json.loads(protect(path.read_bytes(), decrypt=True)) if path.exists() else None


def credentials(interactive=False, client_secrets=None):
    from google.auth.exceptions import RefreshError
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    saved = load_secret("oauth")
    if interactive:
        from google_auth_oauthlib.flow import InstalledAppFlow
        flow = InstalledAppFlow.from_client_secrets_file(str(client_secrets), SCOPES)
        creds = flow.run_local_server(port=0, authorization_prompt_message="Complete YouTube authorization in your browser.",
                                      access_type="offline", prompt="consent")
    elif saved:
        creds = Credentials.from_authorized_user_info(saved["credentials"], scopes=SCOPES)
    else:
        raise ValueError("YouTube is not connected; run auth with your desktop OAuth client JSON")
    if not creds.has_scopes(SCOPES):
        raise ValueError("YouTube authorization lacks required scopes; reconnect")
    if not creds.valid:
        if not creds.refresh_token:
            raise ValueError("OAuth refresh token is missing; reconnect")
        try:
            creds.refresh(Request())
        except RefreshError:
            raise ValueError("OAuth expired or was revoked; reconnect before accessing YouTube") from None
    return creds, saved


def connect(client_secrets, channel_id):
    current = load_secret("oauth")
    if current and current.get("channel_id") != channel_id:
        raise ValueError("Disconnect the current channel before switching accounts")
    creds, _ = credentials(interactive=True, client_secrets=client_secrets)
    api = YouTube(creds)
    api.require_channel(channel_id)
    save_secret("oauth", {"credentials": json.loads(creds.to_json()), "channel_id": channel_id,
                          "authorized_at": timestamp()})


def client():
    creds, saved = credentials()
    api = YouTube(creds)
    api.require_channel(saved["channel_id"])
    save_secret("oauth", {**saved, "credentials": json.loads(creds.to_json()), "authorized_at": timestamp()})
    return api


def disconnect():
    import requests
    from analytics import purge
    saved = load_secret("oauth")
    failed = False
    if saved:
        token = saved["credentials"].get("refresh_token") or saved["credentials"].get("token")
        try:
            response = requests.post("https://oauth2.googleapis.com/revoke", data={"token": token}, timeout=30)
            failed = response.status_code not in (200, 400)
        except requests.RequestException:
            failed = True
    for path in ROOT.glob("videos/*/video.json"):
        purge(path.parent, delete_all=True)
    for path in secret_path("oauth").parent.glob("*.secret"):
        path.unlink()
    if failed:
        raise ValueError("Local data removed; remote revocation failed. Revoke access in Google account permissions")


def api_error(error):
    from googleapiclient.errors import HttpError
    from google.auth.exceptions import RefreshError
    if isinstance(error, RefreshError):
        return ValueError("OAuth expired or was revoked; reconnect")
    if isinstance(error, HttpError):
        status = getattr(error.resp, "status", "unknown")
        reason = "requestFailed"
        try:
            candidate = json.loads(error.content)["error"]["errors"][0]["reason"]
            if re.fullmatch(r"[a-zA-Z0-9_-]+", candidate):
                reason = candidate
        except (ValueError, KeyError, IndexError, TypeError):
            pass
        return ValueError(f"YouTube API {status}: {reason}; operation state retained for recovery")
    return ValueError("YouTube transport failed; operation state retained for recovery")


class YouTube:
    def __init__(self, creds):
        from googleapiclient.discovery import build
        self.data = build("youtube", "v3", credentials=creds, cache_discovery=False)
        self.analytics = build("youtubeAnalytics", "v2", credentials=creds, cache_discovery=False)
        logging.getLogger("googleapiclient.http").setLevel(logging.ERROR)

    def execute(self, request):
        try:
            return request.execute(num_retries=3)
        except Exception as error:
            raise api_error(error) from None

    def require_channel(self, channel_id):
        result = self.execute(self.data.channels().list(part="id", mine=True))
        if channel_id not in {item["id"] for item in result.get("items", [])}:
            raise ValueError("Authorized YouTube account does not match the selected channel")

    def video(self, video_id):
        result = self.execute(self.data.videos().list(part="snippet,status,processingDetails,statistics,contentDetails", id=video_id))
        if len(result.get("items", [])) != 1:
            raise ValueError("Remote video is missing or inaccessible; no replacement will be uploaded automatically")
        return result["items"][0]

    def thumbnail(self, video_id, path):
        from googleapiclient.http import MediaFileUpload
        return self.execute(self.data.thumbnails().set(videoId=video_id, media_body=MediaFileUpload(str(path))))

    def release(self, video_id, config):
        status = {"privacyStatus": config["visibility"], "selfDeclaredMadeForKids": config["made_for_kids"],
                  "containsSyntheticMedia": config["contains_synthetic_media"]}
        if config.get("publish_at"):
            if moment(config["publish_at"]) <= now():
                raise ValueError("Schedule became past due; obtain approval for a future time")
            status.update(privacyStatus="private", publishAt=moment(config["publish_at"]).isoformat())
        return self.execute(self.data.videos().update(part="status", body={"id": video_id, "status": status}))

    def metadata(self, video_id, data, remote):
        config = data["config"]
        snippet = {"title": config["titles"][config["selected_title"]]["text"], "description": data["description"],
                   "categoryId": str(config["category_id"]), "defaultLanguage": config["language"], "tags": config.get("tags", [])}
        status = {"privacyStatus": "private", "selfDeclaredMadeForKids": config["made_for_kids"],
                  "containsSyntheticMedia": config["contains_synthetic_media"]}
        if remote["status"].get("publishAt"):
            status["publishAt"] = remote["status"]["publishAt"]
        return self.execute(self.data.videos().update(part="snippet,status", body={"id": video_id, "snippet": snippet, "status": status}))

    def report(self, **parameters):
        rows = []
        headers = None
        while True:
            response = self.execute(self.analytics.reports().query(**parameters, startIndex=len(rows) + 1, maxResults=200))
            headers = response.get("columnHeaders", headers)
            page = response.get("rows", [])
            rows.extend(page)
            if len(page) < 200:
                return {"columnHeaders": headers or [], "rows": rows}

    def upload(self, project, data):
        from googleapiclient.http import HttpRequest, MediaFileUpload
        config = data["config"]
        name = "upload-" + project.name
        saved = load_secret(name)
        if saved and (saved["version"] != data["version"] or saved["channel_id"] != config["channel_id"]):
            raise ValueError("Saved upload belongs to another package/channel; recover it before retrying")
        if saved and saved.get("video_id"):
            return saved["video_id"]
        if saved and saved.get("request"):
            state = json.loads(saved["request"])
            request = HttpRequest.from_json(saved["request"], self.data._http, self.data._model.response)
            request.resumable_uri = state.get("resumable_uri")
            request.resumable_progress = state.get("resumable_progress", 0)
            request._in_error_state = True
            if not request.resumable_uri:
                raise ValueError("Upload session is ambiguous; inspect Studio and use recover-upload before retrying")
        else:
            snippet = {"title": config["titles"][config["selected_title"]]["text"], "description": data["description"],
                       "categoryId": str(config["category_id"]), "defaultLanguage": config["language"]}
            if config.get("tags"):
                snippet["tags"] = config["tags"]
            request = self.data.videos().insert(part="snippet,status", notifySubscribers=config["notify_subscribers"],
                body={"snippet": snippet, "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": config["made_for_kids"],
                                                      "containsSyntheticMedia": config["contains_synthetic_media"]}},
                media_body=MediaFileUpload(str(data["video"]), mimetype="video/mp4", chunksize=8 * 1024 * 1024, resumable=True))
            # Persist the session before sending media, including a one-chunk upload.
            headers = {**request.headers, "X-Upload-Content-Type": "video/mp4",
                       "X-Upload-Content-Length": str(request.resumable.size()), "content-length": str(request.body_size)}
            try:
                response, _ = request.http.request(request.uri, method=request.method, body=request.body, headers=headers)
            except Exception as error:
                raise api_error(error) from None
            if response.status != 200 or not response.get("location"):
                raise ValueError("YouTube could not create a resumable session; no media was transferred")
            request.resumable_uri = response["location"]
        def persist(video_id=None):
            save_secret(name, {"version": data["version"], "channel_id": config["channel_id"],
                               "request": request.to_json(), "video_id": video_id})
        persist()
        try:
            result = None
            while result is None:
                _, result = request.next_chunk(num_retries=3)
                persist(result["id"] if result else None)
            return result["id"]
        except Exception as error:
            persist()
            raise api_error(error) from None
