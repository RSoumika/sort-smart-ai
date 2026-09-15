# SortSmart — AI-Assisted Waste Segregation

SortSmart is a text-based prototype that helps people understand how to sort everyday waste. Users describe an item and receive a likely waste category, disposal guidance, safety precautions and supporting knowledge-base passages.

Developed by **R. Soumika** for the **1M1B AI for Sustainability Virtual Internship**, in collaboration with **IBM SkillsBuild and AICTE**.

## Live Demo

[Try SortSmart](https://sort-smart-ai.onrender.com)

The free hosting service may take about a minute to wake up after inactivity.

## The Problem

People often feel unsure about which bin to use or whether an item requires special handling. Incorrect sorting can contaminate recyclables and mix hazardous materials with ordinary household waste.

SortSmart aims to make disposal guidance easier to understand for students, households and campus communities.

## SDG Alignment

- **Primary — SDG 12: Responsible Consumption and Production**  
  Encourage informed waste sorting and responsible disposal.
- **Secondary — SDG 11: Sustainable Cities and Communities**  
  Support awareness of safer community waste-management practices.

These are intended contributions. Environmental impact has not yet been measured.

## Features

- Text-based waste-item descriptions.
- Likely waste classification and disposal guidance.
- Special-handling precautions for hazardous items.
- Clarification for uncertain or multiple-item descriptions.
- Expandable supporting knowledge-base passages.
- An implemented Retrieval-Augmented Generation (RAG) pipeline.
- Clearly labelled local guidance when AI generation is unavailable.

**Photo upload is not part of the current interface.**

## How It Works

1. The user describes a waste item.
2. SortSmart retrieves relevant records using keyword and fuzzy matching.
3. Local classification and safety rules produce structured guidance.
4. When API access is available, an AI model receives the description and retrieved passages to generate an explanation.
5. SortSmart validates returned source IDs and displays the supporting passages.

The generated explanation supplements the guidance. It does not replace the deterministic category or special-handling fields.

## RAG Status

The RAG pipeline is implemented, but **live generation has not been verified and is currently limited by API access/credits**.

Without working API access, the application returns local rule-based guidance and labels the AI explanation as unavailable. This fallback is **not a generated RAG response**.

The retrieval source is a curated educational knowledge base—not a verified municipal-policy database. Source-ID validation does not guarantee that a generated explanation is factually correct.

## IBM Bob Contribution

IBM Bob was used during development to review classification logic, improve handling of reported cases and add regression tests.

Examples include:

- Distinguishing “android tablet” from medicine.
- Treating “phone case” as an accessory rather than electronic waste.
- Handling uncertainty for “dirty paper.”
- Requesting separate descriptions for multiple items.

IBM Bob supported development; it does not power the running application.

## Technology Stack

- React
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- OpenAI Responses API for optional RAG generation
- Zod for validation
- Node.js test runner

## Run Locally

### Prerequisites

- Node.js 22.12+ on the Node 22 release line, or a newer release compatible with Vite 8.
- npm.
- Optional: an OpenAI API key with available credits and access to the configured model.

### Installation

```bash
git clone https://github.com/RSoumika/sort-smart-ai.git
cd sort-smart-ai
npm ci
npm run dev
```

Open the local address printed in the terminal.

Local rule-based text guidance works without an API key.

### Enable Optional AI Generation

Copy `.env.example` to `.env`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure:

```dotenv
OPENAI_API_KEY=your_api_key_here
OPENAI_RAG_MODEL=gpt-4.1-mini
```

The configured model must be available to your API account and support the Responses API and Structured Outputs.

Restart the development server after editing `.env`.

**Never commit `.env` or API keys.** API usage may incur charges. Leave the key unset if you only want local guidance.

## Tests and Build

```bash
npm run test:rag
npm run typecheck
npm run build
```

At the latest verification:

- **22 automated tests passed.**
- **TypeScript validation passed.**
- The application’s production build was previously verified.

Tests cover specific classification cases, retrieval, source validation, fallback behaviour and safety preservation. Some tests use simulated AI responses.

Passing tests does **not** establish 100% real-world classification accuracy or successful live AI generation.

## Responsible AI Considerations

### Fairness

English-language matching and limited knowledge-base coverage may reduce usefulness for some users and locations.

### Transparency

The interface displays supporting passages, uncertainty and whether generated explanations are unavailable.

### Ethics and Safety

SortSmart preserves hazardous-waste precautions and recommends local verification. It is an educational assistance tool, not a substitute for official disposal instructions.

### Privacy

Avoid entering personal or sensitive information. When AI generation is configured, descriptions and retrieved guidance are sent to an external AI provider. Credentials should remain server-side and outside version control.

## Current Limitations

- No live municipal-policy integration.
- English-focused keyword and fuzzy matching.
- Some ambiguous, contaminated or negated descriptions need further refinement.
- Multiple-item detection can also flag a single-item description containing conjunctions.
- Generated RAG explanations depend on working API access.
- No measured environmental impact or field evaluation.
- Additional access controls, rate limits and operational safeguards are needed before public production use.

Any impact-dashboard figures are illustrative demo values, not measured outcomes.

## Future Improvements

- Add reviewed municipal disposal policies with source links and location details.
- Expand classification tests and collect user feedback.
- Enable and evaluate live RAG generation.
- Improve language support and handling of ambiguous descriptions.
- Strengthen deployment safeguards.

## Project Status

**Educational internship prototype.**

The project demonstrates waste guidance, knowledge retrieval, safety checks and an implemented RAG workflow. Its current limitations are documented above.

## References

- Project Creation & Guideline — AI for Sustainability Virtual Internship, July–September 2026
- [United Nations — SDG 12](https://sdgs.un.org/goals/goal12)
- [United Nations — SDG 11](https://sdgs.un.org/goals/goal11)
- [IBM Bob Documentation](https://bob.ibm.com/docs/ide)
- [OpenAI Structured Outputs Documentation](https://developers.openai.com/api/docs/guides/structured-outputs)
