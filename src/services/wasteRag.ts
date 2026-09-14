import { z } from "zod";
import { classify, type AnalysisResult } from "./wasteAnalysis";
import { retrieveWasteItems } from "./wasteRetrieval";
import { evaluateWasteSafety } from "./wasteSafety";

export const ragInput = z.object({
  query: z.string().trim().min(1).max(500),
  inputType: z.enum(["text", "image"]).default("text"),
});

export interface Evidence {
  id: string;
  title: string;
  passage: string;
}

export interface RagDetails {
  status: "generated" | "unavailable" | "insufficient-evidence";
  sources: Evidence[];
  summary?: string;
}

export const answerSchema = z
  .object({
    supported: z.boolean(),
    explanation: z.string().min(1).max(1600),
    sourceIds: z.array(z.string()).min(1).max(3),
  })
  .strict();

export type Generate = (query: string, sources: Evidence[]) => Promise<unknown>;

// Lexical retrieval is intentional: this small corpus needs no vector database.
// Generation receives actual retrieved passages, never just an item/category label.
export function retrieveEvidence(query: string): Evidence[] {
  return retrieveWasteItems(query, 3)
    .filter(({ score }) => score >= 0.68)
    .map(({ item }) => ({
      id: item.id,
      title: item.name,
      passage: [item.recommendedAction, item.specialHandling, item.explanation]
        .filter(Boolean)
        .join(" "),
    }));
}

export async function runWasteRag(
  input: z.input<typeof ragInput>,
  generate?: Generate,
): Promise<AnalysisResult> {
  const { query, inputType } = ragInput.parse(input);
  const base = classify(query, inputType);
  const safety = evaluateWasteSafety(base);
  const result: AnalysisResult = {
    ...base,
    // An educational corpus is not enough to authorize disposal locally.
    requiresVerification: true,
    safetyDecision: safety.decision === "safe" ? "verify" : safety.decision,
    safetyReason:
      safety.decision === "safe"
        ? "Verify local acceptance and the item's condition before disposal."
        : safety.reason,
  };
  const sources = retrieveEvidence(query);
  if (!sources.length || base.category === "unknown" || base.confidence === "low") {
    return { ...result, rag: { status: "insufficient-evidence", sources } };
  }
  if (!generate) return { ...result, rag: { status: "unavailable", sources } };
  try {
    const answer = answerSchema.parse(await generate(query, sources));
    const ids = new Set(answer.sourceIds);
    if (!answer.supported || [...ids].some((id) => !sources.some((s) => s.id === id))) {
      return { ...result, rag: { status: "insufficient-evidence", sources } };
    }
    return {
      ...result,
      // Generated text supplements rather than replaces deterministic safety guidance.
      rag: {
        status: "generated",
        summary: answer.explanation,
        sources: sources.filter((s) => ids.has(s.id)),
      },
    };
  } catch {
    // Never expose provider errors, credentials, or raw responses to the client.
    return { ...result, rag: { status: "unavailable", sources } };
  }
}
