# Clone a reference voice: quick guide

Use the installed [Supertonic voice-cloning tool](https://github.com/Mimocro/supertonic-voice-cloning)
and `scripts/clone_supertonic.sh`. Run commands from the repository root in
PowerShell. The existing WSL environment and models are ready; reuse them.

## 1. Prepare the reference

Place the recording at `reference/voice.wav`. Choose an unused work directory,
such as `.tools/supertonic3-model/clone-work-new/`, for a new recording. This
prevents the tool from loading another recording's cached transcript or latent.

Create `ref_text.txt` inside that directory with one accurately transcribed
sentence and its measured start/end times in seconds:

```text
<one complete sentence from the recording>
# window: <start>,<end>
# dur_target: <sentence duration including its trailing pause>
```

Replace the placeholders with the recording's values. Keep the full recording
for speaker identity; the window selects the sentence used for alignment.
For the unchanged reference, reuse `clone-work/ref_text.txt` and its work
directory instead.

## 2. Generate the voice JSON

```powershell
wsl -d Ubuntu-22.04 -- bash /mnt/d/Project/Javascript/hyperframes-channel/scripts/clone_supertonic.sh --output ../supertonic3-model/clone-work-new/channel-voice.json
```

Use the directory chosen in step 1. The wrapper reads `reference/voice.wav`
and runs 500 voice iterations, 500 reference-latent iterations, batch size 2.
It handles local caches and the Linux runtime. Override paths are relative
to `.tools/supertonic-voice-cloning/`.

Result: `.tools/supertonic3-model/clone-work-new/channel-voice.500.json`.
The tool writes a checkpoint suffix; it does not write the literal output name.

## 3. Check one sample

Require finite JSON tensors: `style_ttl` `[1,50,256]`, `style_dp` `[1,8,16]`.
Generate a short sample from the candidate:

```powershell
wsl -d Ubuntu-22.04 -- /mnt/d/Project/Javascript/hyperframes-channel/.tools/supertonic-voice-cloning/.venv-wsl/bin/python /mnt/d/Project/Javascript/hyperframes-channel/.tools/supertonic-voice-cloning/src/synth_onnx.py --onnx-dir /mnt/d/Project/Javascript/hyperframes-channel/.tools/supertonic3-model/onnx --voice /mnt/d/Project/Javascript/hyperframes-channel/.tools/supertonic3-model/clone-work-new/channel-voice.500.json --text "A packet leaves your phone. The router sends it toward the internet." --out /mnt/d/Project/Javascript/hyperframes-channel/.tools/supertonic3-model/clone-work-new/sample.wav
```

Listen for intelligibility and resemblance to the reference. Keep the active
clone unchanged until the candidate passes. Training similarity is not a
listening verdict.

## 4. Install and reuse

Preserve the existing channel JSON under an unused backup filename, then copy
the candidate to `.tools/supertonic3-model/voice_styles/channel-voice.json`.
Record the reference and JSON SHA-256, selected checkpoint and sample result
in the work directory's `CLONE_REPORT.md`.

Future videos load this JSON on Windows through `scripts/supertonic_tts.py`;
follow `BUILD.md` for narration. Confirm the first narration's metadata records
the installed `voice_style_sha256`. Restore the backup if loading fails.

Reuse the clone when the reference is unchanged. Skip dependency reinstalls,
duplicate Windows CUDA downloads, benchmark runs and repeated smoke fits.
Use ASR or speaker scoring only to investigate a sample problem. Cloning
does not require assembling or rendering a video.
