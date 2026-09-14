import type { WasteCategory } from "@/data/wasteKnowledgeBase";
import type { SafetyDecision } from "@/services/wasteSafety";

export interface WasteEvaluationCase {
  name: string;
  input: string;
  expectedCategory: WasteCategory;
  expectedSafetyDecision: SafetyDecision;
}

export const WASTE_EVALUATION_CASES: WasteEvaluationCase[] = [
  {
    name: "Plastic bottle",
    input: "plastic bottle",
    expectedCategory: "recyclable",
    expectedSafetyDecision: "safe",
  },
  {
    name: "Banana peel",
    input: "banana peel",
    expectedCategory: "biodegradable",
    expectedSafetyDecision: "safe",
  },
  {
    name: "Used battery",
    input: "used battery",
    expectedCategory: "hazardous",
    expectedSafetyDecision: "special-handling",
  },
  {
    name: "Old phone",
    input: "old phone",
    expectedCategory: "ewaste",
    expectedSafetyDecision: "special-handling",
  },
  {
    name: "Laptop charger",
    input: "laptop charger",
    expectedCategory: "ewaste",
    expectedSafetyDecision: "special-handling",
  },
  {
    name: "Medicine",
    input: "expired medicine",
    expectedCategory: "hazardous",
    expectedSafetyDecision: "special-handling",
  },
  {
    name: "Broken glass",
    input: "broken glass",
    expectedCategory: "unknown",
    expectedSafetyDecision: "verify",
  },
  {
    name: "Used cooking oil",
    input: "used cooking oil",
    expectedCategory: "hazardous",
    expectedSafetyDecision: "special-handling",
  },
  {
    name: "Clean paper",
    input: "paper",
    expectedCategory: "recyclable",
    expectedSafetyDecision: "safe",
  },
  {
    name: "Unidentified object",
    input: "mystery object",
    expectedCategory: "unknown",
    expectedSafetyDecision: "verify",
  },
];
