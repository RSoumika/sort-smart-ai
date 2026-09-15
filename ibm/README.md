# IBM Bob usage in SortSmart

IBM Bob was used during development to debug and improve SortSmart's text-based waste classification and add regression tests. This folder contains selected, unmodified screenshots supplied by the project author from that interaction. It is manually assembled supporting documentation, not an automatically generated `.bob` folder or conversation log.

## Task given to Bob

Inspect the project and fix four reported classification problems while preserving the text-only interface, existing RAG pipeline, source citations, and hazardous-waste precautions. Add regression tests and run tests, TypeScript checks, and a production build. The prompt also instructed Bob not to read or reveal `.env` credentials or add paid services.

See [the original prompt](screenshots/01-project-prompt.png) and [Bob's initial analysis](screenshots/02-bob-analysis.png), which includes the IBM BOB interface label.

## Contributions

- **Android tablet:** adjusted matching so the reported electronic device input is classified as e-waste instead of medicine.
- **Phone case:** added accessory matching ahead of electronic-device matching, avoiding automatic e-waste classification for the tested accessory input. This is a prototype classification rule, not a universal disposal rule for all case materials.
- **Dirty paper:** added contamination-aware matching that returns an uncertain result and clarification rather than a confident recycling recommendation.
- **Plastic bottle and banana peel:** added a multiple-item check asking the user to submit items separately instead of returning a single classification.

The session identifies changes to `src/services/wasteAnalysis.ts` and `src/evaluation/wasteRag.test.ts`.

## Testing and iteration

The screenshots record an initial run with 21 of 22 tests passing. Bob traced the failing comma-separated-items test to input normalization removing commas, adjusted the check to inspect raw input, and reran the tests.

Bob's final session report shows:

- 22 tests passed, 0 failed: 10 existing tests and 12 new regression tests.
- TypeScript check (`tsc --noEmit`): no errors reported.
- Production build (`vite build`): success reported.

These screenshots document the development session's results, not a fresh verification of every subsequent project version. To check the current checkout, run `npm run test:rag`, `npm run typecheck`, and `npm run build` from the project root.

## Evidence index

1. [Project prompt](screenshots/01-project-prompt.png)
2. [IBM Bob interface and initial analysis](screenshots/02-bob-analysis.png)
3. [Implementation activity](screenshots/03-implementation.png)
4. [Test failure, diagnosis, correction, and rerun](screenshots/04-test-failure-and-correction.png)
5. [Device and accessory fix summary](screenshots/05-device-and-accessory-fixes.png)
6. [Contaminated paper and multiple-item fix summary](screenshots/06-paper-and-multiple-item-fixes.png)
7. [Regression cases and 22 passing tests](screenshots/07-regression-test-results.png)
8. [TypeScript/build report and remaining limitations](screenshots/08-validation-and-limitations.png)

## Scope and limitations

Bob assisted with debugging and testing; it is not the runtime AI service used by SortSmart. This evidence does not claim that Bob originally built the entire application or its RAG pipeline.

The session also acknowledges limitations in ambiguous uses of “tablet”, contamination wording, and multiple-item detection. Rule-based matching is not a trained vision model or vector retrieval system, and passing these tests does not establish accuracy for all waste descriptions. Some early suggestions in the screenshots were exploratory; the final implementation and current source code determine actual behavior.

The deployed prototype can use built-in guidance without an API key. AI-generated RAG explanations require a working configured provider. These Bob screenshots do not demonstrate live AI generation or measured environmental impact.
