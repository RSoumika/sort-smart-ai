import { WASTE_EVALUATION_CASES } from "@/evaluation/wasteEvaluationCases";
import { classify } from "@/services/wasteAnalysis";
import { evaluateWasteSafety } from "@/services/wasteSafety";

export interface WasteEvaluationResult {
  name: string;
  input: string;
  expectedCategory: string;
  predictedCategory: string;
  expectedSafetyDecision: string;
  predictedSafetyDecision: string;
  categoryCorrect: boolean;
  safetyCorrect: boolean;
}

export function runWasteEvaluation(): WasteEvaluationResult[] {
  return WASTE_EVALUATION_CASES.map((testCase) => {
    const analysis = classify(testCase.input);
    const safety = evaluateWasteSafety(analysis);

    return {
      name: testCase.name,
      input: testCase.input,
      expectedCategory: testCase.expectedCategory,
      predictedCategory: analysis.category,
      expectedSafetyDecision: testCase.expectedSafetyDecision,
      predictedSafetyDecision: safety.decision,
      categoryCorrect: analysis.category === testCase.expectedCategory,
      safetyCorrect: safety.decision === testCase.expectedSafetyDecision,
    };
  });
}

export interface WasteEvaluationMetrics {
  totalCases: number;
  categoryAccuracy: number;
  safetyAccuracy: number;
  categoryCorrect: number;
  safetyCorrect: number;
}

export function calculateWasteEvaluationMetrics(
  results: WasteEvaluationResult[],
): WasteEvaluationMetrics {
  const totalCases = results.length;

  if (totalCases === 0) {
    return {
      totalCases: 0,
      categoryAccuracy: 0,
      safetyAccuracy: 0,
      categoryCorrect: 0,
      safetyCorrect: 0,
    };
  }

  const categoryCorrect = results.filter((result) => result.categoryCorrect).length;

  const safetyCorrect = results.filter((result) => result.safetyCorrect).length;

  return {
    totalCases,
    categoryAccuracy: categoryCorrect / totalCases,
    safetyAccuracy: safetyCorrect / totalCases,
    categoryCorrect,
    safetyCorrect,
  };
}
