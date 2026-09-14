import type { AnalysisResult } from "@/services/wasteAnalysis";

export type SafetyDecision = "safe" | "special-handling" | "verify";

export interface SafetyResult {
  decision: SafetyDecision;
  reason: string;
  requiresVerification: boolean;
}

export function evaluateWasteSafety(analysis: AnalysisResult): SafetyResult {
  if (analysis.category === "hazardous") {
    return {
      decision: "special-handling",
      reason:
        "This item may contain hazardous materials and should not be placed in a regular household bin.",
      requiresVerification: true,
    };
  }

  if (analysis.category === "ewaste") {
    return {
      decision: "special-handling",
      reason:
        "Electronic items should be handled through an appropriate e-waste collection or recycling channel.",
      requiresVerification: true,
    };
  }

  if (
    analysis.category === "unknown" ||
    analysis.confidence === "low" ||
    analysis.requiresVerification
  ) {
    return {
      decision: "verify",
      reason:
        "The item cannot be classified with enough certainty for a fully confident disposal recommendation.",
      requiresVerification: true,
    };
  }

  return {
    decision: "safe",
    reason:
      "The item has a sufficiently confident classification and does not require special handling.",
    requiresVerification: false,
  };
}
