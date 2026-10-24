# Research fact sheet

Checked 2026-10-24. Primary sources: the official release blog
(<https://www.kimi.com/en/blog/kimi-k3-1-pro>) and Kimi Code model documentation
(<https://www.kimi.com/code/docs/en/kimi-code/models.html>), both fetched and read
in full. Secondary reporting was used only to date the announcement, never for a
number used on screen or in narration.

| ID | Supported fact | Source | Qualification as used |
| --- | --- | --- | --- |
| release | Kimi K3.1 Pro is the first model of the K3.1 series: a 3T-class open-weight model with a 1M-token context window, released with K3.1 Pro Highspeed. | release blog, Availability | Secondary reporting dates the announcement to 23–24 October 2026 depending on timezone, so narration says "this week", not a day. |
| weights | Full model weights "will be released by Nov 4, 2026". | release blog, Availability | Not open yet at publication; narration states the date as a future event. |
| access | Available on Kimi.com, Kimi Work, Kimi Code and the Kimi API; Kimi Code selects it with the `/model` command; API IDs are `kimi-k3.1-pro` and `kimi-k3.1-pro-highspeed`. | release blog, Availability; Kimi Code docs, Model Overview | Kimi Enterprise access is off by default at launch. Narration only claims the Kimi Code path it demonstrates. |
| plan | 1M context is available on "Pro and above" for new plans (Allegretto and above on legacy plans). | Kimi Code docs, model table | Narration: "a million tokens needs a Pro plan". The 1M window is a plan capability, not universal. |
| thinking | K3.1 Pro models support thinking mode only; requests with thinking disabled are rejected (HTTP 400). Reasoning effort defaults to `max`. | Kimi Code docs, Usage recommendations and effort mapping | Narration: "thinking mode only, so it is slow". No latency number is claimed. |
| highspeed | K3.1 Pro Highspeed has identical capabilities at approximately 2–3× the speed, using about twice the quota. | release blog; Kimi Code docs, model table | Both halves are always stated together; Highspeed does not speed up tool calls or script execution. |
| officeqa | OfficeQA Pro v2 score 64.4, described as state of the art. The benchmark tests fiscal-document analysis over real financial documents via retrieval, cross-document verification and multi-step numerical reasoning. | release blog, Finance | Evaluated with the Claude Code harness. Single benchmark, single run; narration scopes it to that benchmark. |
| hallu | On Kimi Hallu Bench Hard, claim-level hallucination rate fell from 23.4% (K3) to 8.3%. | release blog, Finance | Internal stress test with deliberately hard prompts; the blog states the rates do not represent daily-use error rates. Narration calls it "Kimi's factuality stress test", and 23.4%/8.3% appear as exact labels. |
| coding | Terminal-Bench 4.0 65.7% (GPT-6 Astra 58.2%, Claude Opus 5.5 66.4%); Kimi Code Bench 3.0 Long-horizon 61.2% vs K3 55.95%. | release blog, Coding | Not used: the video teaches a document workflow, and benchmark-ladder framing would pad the runtime. |
| workflow | Kimi Code is an agentic coding client with built-in tools (file reading/writing, command execution) and user-selected models. | Kimi Code docs, CLI/Built-in Tools | The demonstrated reconciliation is a proposed replication of the documented capability, not a recorded product session. |

## What this video must not claim

- No measured accuracy, time saved, hours recovered, or revenue for the reconciliation
  example. Those outcomes are unverified.
- No invented invoice amounts, company names, or "real" bank data. The folder example is
  a generic workload, described as a workload rather than as a customer story.
- No claim that the model is perfect or that the sheet is correct without review. The
  closing beat exists because the citations are the point.
- No "state of the art overall" claim: 64.4 is scoped to OfficeQA Pro v2, and 8.3% is
  scoped to Kimi's own stress test.
- No claim that high-speed mode removes the thinking cost, and no claim that the weights
  are already open.

## Narration-to-fact map

Line 1 workload premise (illustrative) · 2–4 release, context, OfficeQA Pro v2 ·
5–8 the demonstrated workflow and its expected output · 9 scoped factuality figure ·
10 Highspeed trade-off · 11 plan requirement and weight release date · 12–13 review and
payoff.
