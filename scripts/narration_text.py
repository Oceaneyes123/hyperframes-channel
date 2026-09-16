"""Normalize technical display text into speech text without changing the script."""

from __future__ import annotations

import hashlib
import ipaddress
import json
import re
from pathlib import Path
from typing import Any

DEFAULT_TERMS = {
    "DNS": "D N S",
    "DHCP": "D H C P",
    "HTTP": "H T T P",
    "HTTPS": "H T T P S",
    "TCP": "T C P",
    "UDP": "U D P",
    "IP": "I P",
    "MAC": "M A C",
    "LAN": "L A N",
    "WAN": "W A N",
    "NAT": "N A T",
    "ARP": "A R P",
    "API": "A P I",
    "URL": "U R L",
    "SSH": "S S H",
    "SQL": "sequel",
}
NORMALIZER_VERSION = "1"
_NUMBERS = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
]
_TENS = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
]
_EXTENSIONS = {
    "yml": "Y M L",
    "yaml": "Y A M L",
    "json": "J S O N",
    "html": "H T M L",
    "csv": "C S V",
}


def _number(n: int) -> str:
    if n < 20:
        return _NUMBERS[n]
    if n < 100:
        return _TENS[n // 10] + (f" {_NUMBERS[n % 10]}" if n % 10 else "")
    if n < 1000:
        return (
            _NUMBERS[n // 100]
            + " hundred"
            + (f" {_number(n % 100)}" if n % 100 else "")
        )
    return str(n)


def load_config(project: Path) -> dict[str, Any]:
    path = project / "pronunciation.json"
    if not path.exists():
        return {"terms": {}, "lines": {}, "ipv4_style": "grouped"}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("pronunciation.json must contain an object")
    terms, lines, style = (
        data.get("terms", {}),
        data.get("lines", {}),
        data.get("ipv4_style", "grouped"),
    )
    if not isinstance(terms, dict) or not isinstance(lines, dict):
        raise ValueError("pronunciation.json terms and lines must be objects")
    if any(
        not isinstance(k, str)
        or not k.strip()
        or not isinstance(v, str)
        or not v.strip()
        for k, v in [*terms.items(), *lines.items()]
    ):
        raise ValueError(
            "pronunciation.json overrides require nonempty string keys and values"
        )
    if style not in ("digits", "grouped"):
        raise ValueError("pronunciation.json ipv4_style must be digits or grouped")
    return {"terms": terms, "lines": lines, "ipv4_style": style}


def _ipv4(value: str, style: str) -> str:
    parts = value.split(".")
    if style == "digits":
        return " dot ".join(" ".join(_NUMBERS[int(c)] for c in part) for part in parts)
    return " dot ".join(_number(int(part)) for part in parts)


def _mac(value: str) -> str:
    return ", ".join(" ".join(ch.upper() for ch in pair) for pair in value.split(":"))


def normalize_text(text: str, config: dict[str, Any] | None = None) -> str:
    config = config or {"terms": {}, "lines": {}, "ipv4_style": "grouped"}
    terms = {**DEFAULT_TERMS, **config.get("terms", {})}
    protected: list[tuple[str, bool]] = []

    def hold(value: str, transform: bool = True) -> str:
        protected.append((value, transform))
        return f"\x00{len(protected) - 1}\x00"

    # Keep technical tokens together while replacing punctuation in their spoken form.
    def ipv4(match: re.Match[str]) -> str:
        value = match.group()
        address = value.split("/")[0]
        try:
            ipaddress.ip_interface(value)
            if any(int(part) > 255 for part in address.split(".")):
                return value
            return hold(_ip_token(value, config.get("ipv4_style", "grouped")))
        except ValueError:
            return value

    text = re.sub(r"(?<![\w])(?:\d{1,3}\.){3}\d{1,3}(?:/\d{1,2})?(?![\w])", ipv4, text)
    text = re.sub(
        r"(?<![\w])(?:(?:https?://)?[\w-]+(?:\.[\w-]+)+(?:\:\d+)?(?:/[^\s]*)?)",
        lambda m: hold(m.group()),
        text,
    )

    # IPv6 parsing is delegated to the standard library; leave invalid colon prose alone.
    def ipv6(match: re.Match[str]) -> str:
        value = match.group()
        try:
            address, _, prefix = value.partition("/")
            ipaddress.ip_interface(value)
            groups = address.split(":")
            spoken = (
                " double colon ".join(
                    " colon ".join(
                        " ".join(
                            _NUMBERS[int(ch)] if ch.isdigit() else ch.lower()
                            for ch in group
                        )
                        for group in part.split(":")
                    )
                    for part in address.split("::")
                )
                if "::" in address
                else " colon ".join(
                    " ".join(
                        _NUMBERS[int(ch)] if ch.isdigit() else ch.lower()
                        for ch in group
                    )
                    for group in groups
                )
            )
            return hold(spoken + (f" slash {_number(int(prefix))}" if prefix else ""))
        except ValueError:
            return value

    text = re.sub(
        r"(?<![\w])(?:[0-9A-Fa-f]{0,4}:){2,7}[0-9A-Fa-f]{0,4}(?:/\d{1,3})?(?![\w])",
        ipv6,
        text,
    )
    text = re.sub(
        r"(?<![\w])(?:[0-9A-Fa-f]{2}:){1,5}[0-9A-Fa-f]{2}(?![\w])",
        lambda m: hold(_mac(m.group())),
        text,
    )
    for key, spoken in sorted(terms.items(), key=lambda item: -len(item[0])):
        text = re.sub(
            rf"(?<![\w]){re.escape(key)}(?![\w])",
            lambda _m, s=str(spoken): hold(s, False),
            text,
            flags=re.I,
        )

    # Restore technical tokens with URL, filename, command, and symbol pronunciation.
    def restore(match: re.Match[str]) -> str:
        value, transform = protected[int(match.group(1))]
        if not transform:
            return value
        value = re.sub(r"^https?", lambda m: " ".join(m.group().upper()), value)
        value = (
            value.replace("://", " colon slash slash ")
            .replace("/", " slash ")
            .replace("_", " underscore ")
            .replace("-", " dash ")
            .replace(":", " colon ")
        )
        value = re.sub(r"\.(?=[A-Za-z])", " dot ", value)
        value = re.sub(
            r"\b(?:yml|yaml|json|html|csv)\b",
            lambda m: _EXTENSIONS[m.group().lower()],
            value,
            flags=re.I,
        )
        value = re.sub(
            r"(?<=colon )\d+",
            lambda m: " ".join(_NUMBERS[int(c)] for c in m.group()),
            value,
        )
        return value

    text = text.replace("->", " goes to ").replace("/", " slash ")
    text = re.sub("\\x00(\\d+)\\x00", restore, text)
    text = re.sub(
        r"(?i)(?<![\w])port\s+(\d{1,5})(?![\w])",
        lambda m: m.group(0).split()[0]
        + " "
        + " ".join(_NUMBERS[int(c)] for c in m.group(1)),
        text,
    )
    text = re.sub(
        r"(?<!\w)([\w./-]*_[\w./-]*)(?!\w)",
        lambda m: m.group().replace("_", " underscore "),
        text,
    )
    return re.sub(r"\s+", " ", text).strip()


def _ip_token(value: str, style: str) -> str:
    address, _, prefix = value.partition("/")
    result = _ipv4(address, style)
    return result + (f" slash {_number(int(prefix))}" if prefix else "")


def prepare_narration(
    project: Path, lines: list[tuple[str, str]] | Path
) -> dict[str, Any]:
    if isinstance(lines, Path):
        from supertonic_tts import narration_lines

        lines = narration_lines(lines)
    config = load_config(project)
    line_ids = {line_id for line_id, _ in lines}
    if any(line_id not in line_ids for line_id in config.get("lines", {})):
        raise ValueError("pronunciation.json contains an unknown line override")
    records = []
    for line_id, original in lines:
        spoken = str(
            config.get("lines", {}).get(line_id, normalize_text(original, config))
        )
        records.append(
            {"id": line_id, "original_text": original, "spoken_text": spoken}
        )
    fingerprint = hashlib.sha256(
        json.dumps(
            {"version": NORMALIZER_VERSION, "config": config, "lines": records},
            sort_keys=True,
        ).encode()
    ).hexdigest()
    return {
        "lines": records,
        "normalization": {
            "version": NORMALIZER_VERSION,
            "config": config,
            "fingerprint": fingerprint,
        },
    }
