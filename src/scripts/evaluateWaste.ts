import {
  calculateWasteEvaluationMetrics,
  runWasteEvaluation,
} from "../evaluation/runWasteEvaluation";

const results = runWasteEvaluation();
const metrics = calculateWasteEvaluationMetrics(results);

console.log("\nSortSmart Evaluation\n");
console.log(`Cases: ${metrics.totalCases}`);
console.log(`Category accuracy: ${(metrics.categoryAccuracy * 100).toFixed(1)}%`);
console.log(`Safety accuracy: ${(metrics.safetyAccuracy * 100).toFixed(1)}%`);

console.log("\nCase results:");

for (const result of results) {
  console.log(
    `${result.categoryCorrect && result.safetyCorrect ? "PASS" : "FAIL"} — ${result.name}`,
  );
  console.log(`  Category: ${result.predictedCategory} (expected ${result.expectedCategory})`);
  console.log(
    `  Safety: ${result.predictedSafetyDecision} (expected ${result.expectedSafetyDecision})`,
  );
}
