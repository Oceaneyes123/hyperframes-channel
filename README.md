# HyperFrames channel workspace

Local tools and production records for the channel. Work from the folder that owns
the task; this repository is not one installable application.

| Folder | Responsibility | Setup and commands |
| --- | --- | --- |
| [`2d-animation-v3`](2d-animation-v3/README.md) | Active local Studio: writing, storyboard, motion review and guarded production foundations | Node >=24.6 and <25; `npm ci`, `npm run db:init`, `npm run dev` from that folder. Studio: <http://127.0.0.1:3003>. |
| [`2d-animation-v2`](2d-animation-v2/README.md) | OneTake production workflow with explicit creative and render gates | Python, its `requirements.txt`, Playwright Chromium, Node, FFmpeg and ffprobe. Follow the folder README for its environment and installed skills. |
| [`2d-animation`](2d-animation/BUILD.md) | Legacy v1 and shared tooling/assets still used by v2 | V2 imports its narration parser and invokes its TTS script and local channel voice clone. See [`VOICE_CLONE.md`](2d-animation/VOICE_CLONE.md) for voice setup. Do not move or delete this folder. |
| [`video-workflow`](video-workflow/README.md) | Publishing preparation, separately authorized YouTube release and analytics | Python and its `requirements.txt`. Run `python video-workflow/scripts/channel.py --help` from the root. The current adapter consumes v2 production projects. |
| `motion-audits` | Historical independent review reports | Evidence, not a production entry point. Some reports reference ignored local projects. |
| `outputs` | Retained channel narration audition and receipts | The v1 audio-version reference links here. Future generated media is ignored. |

V3's [animation workflow](2d-animation-v3/docs/animation-workflow.md) describes
current capabilities and limits. Older roadmap statements are historical. The
original `docs/PLAN.md` and `docs/PLAN2.md` are preserved. Read each folder's
`AGENTS.md` before working there. Production, publishing and account actions keep
their existing explicit approval requirements.

## Local data and historical evidence

Dependencies, models, environment files, SQLite data, production projects and
generated media are local. Keep credentials outside Git. Back up local data and
project files together; a fresh clone does not contain the voice clone, Studio
database or every original immutable production input.

The [housekeeping record](docs/housekeeping/README.md) explains the archived media,
restoration, historical hash checks, preserved representative images and local
history rewrite. Historical media links resolve after restoring the evidence
bundle. Source scripts, manifests, frozen evaluation text and required runtime
fonts/media remain tracked.

## Prevent large-file uploads

Generated media, frames, seek captures, logs and archives are ignored. Git ignores
do not enforce sizes or stop `git add -f`. Install this checkout's hooks once:

```powershell
git config --local core.hooksPath .githooks
python scripts/check-repo-files.py --staged
```

The commit hook checks staged bytes. The push hook checks new reachable Git
objects, including a large file added and deleted between commits. New blobs over
**5 MiB** are rejected. Exact pre-existing blob IDs have documented exceptions;
changing a large legacy asset requires review. CI also checks reachable history.
Hooks can be bypassed and CI runs after upload; server-side branch protection must
require the CI job to enforce merging. No repository file can prevent an owner
from deliberately bypassing local checks or pushing directly.

Store bulky rendered evidence in a checksummed external bundle. Keep necessary
runtime source assets and their license/provenance records. Do not add LFS or
rewrite history for a routine media update without an explicit decision.

## Checks

```powershell
python -m unittest discover -s scripts/tests -v
Push-Location 2d-animation-v3
npm ci
npm run check
npm run build
Pop-Location
Push-Location 2d-animation-v2
python -m unittest discover -s tests -v
Pop-Location
Push-Location video-workflow
python -m unittest discover -s tests -v
Pop-Location
```

V2's narration test needs the local v1 clone. Historical 731-file v2 and 22-file
benchmark hash checks are separate from these commands; see the housekeeping
record. Never update their expected hashes merely to conceal missing evidence.
