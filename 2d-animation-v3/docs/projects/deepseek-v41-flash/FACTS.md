# Research fact sheet

Checked October 24, 2026. Primary documentation supports the component capabilities below. No live DeepSeek/n8n integration, customer deployment, sales, accuracy, time saving or revenue has been demonstrated for this project.

| ID | Supported fact | Primary source | Qualification |
| --- | --- | --- | --- |
| model | `deepseek-flash` currently serves DeepSeek-V4.1-Flash-1017. | [First API call](https://api-docs.deepseek.com/), [Models and pricing](https://api-docs.deepseek.com/quick_start/pricing/) | The official version confirms the 1017 update identifier; a separate dated October 17 release announcement was not retrieved. Alias mappings can change. |
| json | JSON Output provides structured JSON through `response_format: {"type":"json_object"}`. | [JSON Output](https://api-docs.deepseek.com/guides/json_mode/) | Include JSON instructions and an example. Allow enough output tokens. Empty responses can occur. Valid JSON does not establish schema compliance or factual accuracy. |
| api | The API supports OpenAI-compatible requests with an API key and `https://api.deepseek.com` base URL. | [First API call](https://api-docs.deepseek.com/) | Calling an API is supported; this specific assistant's performance has not been tested. |
| price | API billing depends on input/output token usage. | [Models and pricing](https://api-docs.deepseek.com/quick_start/pricing/) | USD per million tokens, off-peak/peak: cached input $0.003/$0.006; uncached input $0.15/$0.30; output $0.60/$1.20. Peak: weekdays 01:00–04:00 and 06:00–10:00 UTC except Chinese public holidays. Rates can change. Hosting, n8n and support are additional costs. No fixed per-inquiry cost claimed. |
| trigger | n8n Google Sheets Trigger supports Row added, Row updated, and Row added or updated. | [Sheets Trigger](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.googlesheetstrigger/) | Use Row added to avoid triggering on this workflow's own row updates. Requires Google credentials; do not promise instant delivery. |
| request | n8n HTTP Request can call REST APIs. | [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/) | Use it to specify `deepseek-flash` explicitly without assuming a native model dropdown includes this alias. |
| update | Google Sheets node supports updating existing rows. | [Sheet operations](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/sheet-operations/) | Match an immutable inquiry ID. Validate output before writing. |
| approval | Gmail node can notify the owner and wait for approval. | [Message operations](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/message-operations/) | This video's minimal design ends at owner review; the owner edits and sends manually. No automatic customer send node is required. |

## Business proposal versus evidence

Finding a local salon that repeatedly answers booking questions, offering a setup fee and optional maintenance are proposed business actions. Demand, willingness to pay and results remain unverified. Sell configuration, testing, handover and agreed support in the client's own accounts; do not claim proven savings, guaranteed clients, guaranteed earnings or blanket permission to resell hosted n8n access. No price or earnings figures appear in the narration.

## Proposed demo contract

Customer inquiry → Google Sheets → n8n → DeepSeek category and draft → updated row → owner notification and human approval.

- Use a Google Form linked to Sheets as inquiry intake. Ask the owner about repeated questions before building. Use invented test inquiries rather than customer personal data.
- Fields: `inquiry_id`, `question`, `category`, `reply_draft`, `status`. Feed only the question and owner-approved FAQ to the model. Store credentials in n8n credentials, never in Sheets or graphics.
- Trigger on Row added; ignore rows already processed. POST `/chat/completions` with model `deepseek-flash`, JSON Output and an example containing `category`, `reply_draft`, `needs_owner`.
- The model proposes classification and a draft. Application checks allowed categories, required fields and empty/truncated output. Missing information must produce a clarification or owner review; it must never invent prices, hours, availability or bookings.
- Update the original row by `inquiry_id` with `status=pending_review`. Notify only the owner with a link to the row. The owner checks facts, edits and sends the customer response manually.
- Test booking, opening-hours, missing-information and attempted instruction-override questions. On failure, mark for review and notify the owner; never fall through to sending. Deduplicate processing/notifications before offering a deployed service.

This is a build specification, not an exported or executed n8n workflow. A 50–75-second Short teaches the service playbook and data flow; it cannot teach every credential and node setting.
