# SortSmart RAG setup and demonstration

## Run locally

1. Install a current Node.js release compatible with Vite 8 (Node 22.12+).
2. Run `npm ci` in the extracted project folder.
3. Copy `.env.example` to `.env` and set a NEW `OPENAI_API_KEY`.
   Revoke the key from the original shared archive. Do not reuse it.
4. Set `OPENAI_RAG_MODEL` to a Responses API model with Structured Outputs
   available to your account. The default retains the project's model,
   `gpt-5.6-luna`; account access has not been verified.
5. Set `OPENAI_VISION_MODEL=gpt-4.1-mini` (the default) for photo recognition.
   Restart the development server after changing environment settings.
   Run `npm run dev` and open the address printed by Vite.
6. On Sort Waste, enter `plastic bottle` or `used battery`.
   Look for an AI-generated explanation and expand its source passages.

Without a key, text analysis still returns local guidance, explicitly labelled
as an unavailable AI explanation. Photo identification requires a key.
API requests may incur charges. This archive contains no credentials.

## What makes this RAG

Input -> lexical retrieval of up to three relevant knowledge-base records
-> retrieved passages included in the generation prompt -> server-side LLM
explanation -> schema and source-ID validation -> explanation plus sources.

`src/services/wasteRag.ts` implements retrieval orchestration, relevance threshold,
validation and fallback. `wasteRagServer.ts` invokes OpenAI Responses with the
retrieved text. Both text and photo results use this pipeline. Photo recognition
returns structured object and material fields and uses high-detail vision.
Large photos are resized before upload. The separate Use description instead
button allows manual sorting without silently overriding image identification.

This is lexical RAG, not vector search. Embeddings are not required for RAG;
the small corpus is searched using the existing keyword/fuzzy retrieval engine.
Each curated record is a self-contained passage. Its stable item ID acts as its
citation. These are LOCAL EDUCATIONAL records, not externally verified or
location-specific municipal sources. No municipal policy retrieval is claimed.

The generated explanation supplements the existing deterministic recommendation.
The model cannot change category, confidence, recommended action or special handling.
All RAG-path results request local verification. Unknown/low-confidence inputs or
weak retrieval skip generation. Missing keys, timeouts, refusals and malformed
outputs return labelled local fallback. Unknown citation IDs discard the generated
explanation. Source-ID validation does not establish semantic truth; inspect the
passages and evaluate model explanations before relying on them.

## Privacy and deployment limits

Generation runs server-side with a 20-second provider timeout, no retries, a
500-character input limit, and bounded output. Requests use `store: false`.
This does not promise zero provider retention. Text and photos leave the browser
for OpenAI processing when enabled; the UI discloses this.

Use for a supervised prototype. Before public deployment, add authenticated access,
shared rate/spend limits, stricter server-side image validation, and a reviewed,
region-labelled corpus. Existing keyword classification limitations remain;
RAG alone does not fix ambiguous, negated, contaminated or multiple-item inputs.

## Verification

- `npm run test:rag`: ten offline tests, including photo-to-bottle classification,
  actionable photo errors, injected successful generation,
  provider failure, weak evidence, fabricated citations, invalid output and safety.
- `npm run typecheck`: full TypeScript validation.
- `npm run build`: client and server production build.
- A live provider run requires a replacement key and model access. Offline tests
  exercise the orchestration; they are not evidence of live LLM answer quality.

## Internship evidence

Capture a real generated response with expanded passages, an unknown-item example,
and a fallback example. Explain retrieval, prompt augmentation, generation, source
validation and safety in the presentation. Keep screenshots free of API keys.

IBM Bob usage has NOT been added or claimed. Use Bob genuinely for a development,
testing or documentation task and retain evidence separately if it is mandatory.

API reference: https://developers.openai.com/api/docs/guides/structured-outputs
