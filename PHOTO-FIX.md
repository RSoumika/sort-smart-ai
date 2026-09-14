# Photo recognition update

- Photo recognition now uses configurable `OPENAI_VISION_MODEL`, defaulting to
  `gpt-4.1-mini`, with high-detail image input and structured object/material output.
- A detected bottle with plastic material becomes `plastic bottle` before retrieval.
- Large images are resized to at most 1280 pixels on the longest side before upload.
- Unknown images stay on the upload form with a useful retry message.
- API configuration, access, billing and timeout failures have distinct messages.
- Old text input no longer silently overrides photo detection. Use description
  instead is an explicit, separate action and does not require a vision request.

Set a valid replacement OPENAI_API_KEY in .env, set
OPENAI_VISION_MODEL=gpt-4.1-mini, then restart the server.

Validation: ten offline tests, TypeScript, production build and changed-file lint.
The bottle regression injects a vision response; it does not demonstrate live image
recognition accuracy. The user's original photograph and a live provider request
have not been tested. An unclear photo can still legitimately return unknown.
