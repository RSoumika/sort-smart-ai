import assert from "node:assert/strict";
import test from "node:test";
import { detectImage } from "../services/visionAnalysis";
import { retrieveEvidence, runWasteRag } from "../services/wasteRag";

test("photo object and material reach bottle guidance", async () => {
  const vision = await detectImage("data:image/jpeg;base64,YWJj", async () => ({
    identified: true,
    item: "bottle",
    material: "plastic",
  }));
  assert.equal(vision.ok, true);
  if (!vision.ok) throw new Error("Expected identification");
  assert.equal(vision.description, "plastic bottle");
  const result = await runWasteRag({ query: vision.description, inputType: "image" });
  assert.equal(result.category, "recyclable");
  assert.equal(result.matchedItemId, "plastic-bottle");
});

test("unclear photos and missing configuration do not become fake identifications", async () => {
  const missing = await detectImage("data:image/jpeg;base64,YWJj");
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.match(missing.message, /not configured/);
  for (const item of ["", "unknown", "unknown."]) {
    assert.equal(
      (
        await detectImage("data:image/jpeg;base64,YWJj", async () => ({
          identified: true,
          item,
          material: "unknown",
        }))
      ).ok,
      false,
    );
  }
});

test("photo provider errors are actionable and do not leak raw errors", async () => {
  for (const [status, expected] of [
    [401, /key was rejected/],
    [404, /model is unavailable/],
    [429, /billing limit/],
  ] as const) {
    const result = await detectImage("data:image/jpeg;base64,YWJj", async () => {
      throw { status, message: "private detail" };
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.match(result.message, expected);
      assert.ok(!result.message.includes("private detail"));
    }
  }
});

test("retrieves actual passages for generation and resolves citations", async () => {
  const result = await runWasteRag({ query: "plastic bottle" }, async (query, sources) => {
    assert.equal(query, "plastic bottle");
    assert.ok(sources.some((s) => s.id === "plastic-bottle" && s.passage.includes("rinse")));
    return {
      supported: true,
      explanation: "Check local acceptance and empty the bottle.",
      sourceIds: ["plastic-bottle"],
    };
  });
  assert.equal(result.rag?.status, "generated");
  assert.equal(result.rag.sources[0]?.id, "plastic-bottle");
  assert.equal(result.requiresVerification, true);
});

test("weak evidence skips generation", async () => {
  const result = await runWasteRag({ query: "zxqv mystery object" }, async () => {
    throw new Error("should not call");
  });
  assert.equal(result.rag?.status, "insufficient-evidence");
  assert.deepEqual(retrieveEvidence(""), []);
});

test("missing provider and outages return labelled local fallback", async () => {
  assert.equal((await runWasteRag({ query: "plastic bottle" })).rag?.status, "unavailable");
  const failed = await runWasteRag({ query: "plastic bottle" }, async () => {
    throw new Error("secret provider detail");
  });
  assert.equal(failed.rag?.status, "unavailable");
  assert.ok(!JSON.stringify(failed).includes("secret"));
});

test("fabricated citations and insufficient support never display generated text", async () => {
  for (const answer of [
    { supported: true, explanation: "Untrusted answer", sourceIds: ["invented-source"] },
    { supported: false, explanation: "Untrusted answer", sourceIds: ["plastic-bottle"] },
  ]) {
    const result = await runWasteRag({ query: "plastic bottle" }, async () => answer);
    assert.equal(result.rag?.status, "insufficient-evidence");
    assert.equal(result.rag.summary, undefined);
  }
});

test("malformed output is rejected and hazardous handling is preserved", async () => {
  const result = await runWasteRag({ query: "used battery" }, async () => ({
    category: "recyclable",
  }));
  assert.equal(result.rag?.status, "unavailable");
  assert.equal(result.category, "hazardous");
  assert.equal(result.safetyDecision, "special-handling");
  assert.ok(result.specialHandling);
});

test("valid generation cannot change category or special handling", async () => {
  const result = await runWasteRag({ query: "used battery", inputType: "image" }, async () => ({
    supported: true,
    explanation: "Use a battery collection point; verify locally.",
    sourceIds: ["used-battery"],
  }));
  assert.equal(result.rag?.status, "generated");
  assert.equal(result.category, "hazardous");
  assert.equal(result.inputType, "image");
  assert.equal(result.safetyDecision, "special-handling");
});

test("input validation rejects empty and oversized queries", async () => {
  await assert.rejects(runWasteRag({ query: " " }));
  await assert.rejects(runWasteRag({ query: "a".repeat(501) }));
});

// ---------------------------------------------------------------------------
// Regression tests for context-aware classification fixes
// ---------------------------------------------------------------------------

test("android tablet is classified as e-waste, not medicine", async () => {
  const result = await runWasteRag({ query: "android tablet" });
  assert.equal(result.category, "ewaste", `Expected ewaste, got ${result.category}`);
});

test("ipad is classified as e-waste", async () => {
  const result = await runWasteRag({ query: "ipad" });
  assert.equal(result.category, "ewaste", `Expected ewaste, got ${result.category}`);
});

test("phone case is not classified as e-waste", async () => {
  const result = await runWasteRag({ query: "phone case" });
  assert.notEqual(result.category, "ewaste", "Phone case should not be ewaste");
  assert.equal(result.category, "general", `Expected general, got ${result.category}`);
});

test("tablet case is not classified as e-waste", async () => {
  const result = await runWasteRag({ query: "tablet case" });
  assert.notEqual(result.category, "ewaste", "Tablet case should not be ewaste");
});

test("dirty paper requests clarification instead of confident recycling", async () => {
  const result = await runWasteRag({ query: "dirty paper" });
  // Confidence must not be high — contamination state is unknown
  assert.notEqual(result.confidence, "high", "Dirty paper should not have high confidence");
  // Either unknown category or a clarification question is required
  const needsClarification =
    result.category === "unknown" || result.clarificationQuestion !== null;
  assert.ok(
    needsClarification,
    `Dirty paper should produce unknown category or clarification question; got category=${result.category}`,
  );
});

test("multiple items in one query requests clarification", async () => {
  const result = await runWasteRag({ query: "plastic bottle and banana peel" });
  assert.ok(
    result.clarificationQuestion !== null,
    "Mixed-item query should return a clarification question",
  );
  assert.match(
    result.clarificationQuestion ?? "",
    /separately|separate/i,
    "Clarification should ask the user to submit items separately",
  );
});

test("comma-separated items also request clarification", async () => {
  const result = await runWasteRag({ query: "glass bottle, old phone" });
  assert.ok(
    result.clarificationQuestion !== null,
    "Comma-separated items should request clarification",
  );
});

// ---------------------------------------------------------------------------
// Ordinary single-item inputs should still classify correctly
// ---------------------------------------------------------------------------

test("plastic bottle is classified as recyclable", async () => {
  const result = await runWasteRag({ query: "plastic bottle" });
  assert.equal(result.category, "recyclable", `Expected recyclable, got ${result.category}`);
  assert.equal(result.matchedItemId, "plastic-bottle");
});

test("banana peel is classified as biodegradable", async () => {
  const result = await runWasteRag({ query: "banana peel" });
  assert.equal(result.category, "biodegradable", `Expected biodegradable, got ${result.category}`);
  assert.equal(result.matchedItemId, "banana-peel");
});

test("used battery is classified as hazardous with special handling", async () => {
  const result = await runWasteRag({ query: "used battery" });
  assert.equal(result.category, "hazardous", `Expected hazardous, got ${result.category}`);
  assert.equal(result.safetyDecision, "special-handling");
  assert.ok(result.specialHandling, "Battery should have specialHandling guidance");
});

test("medicine is still classified as hazardous", async () => {
  const result = await runWasteRag({ query: "expired medicine" });
  assert.equal(result.category, "hazardous", `Expected hazardous, got ${result.category}`);
});

test("pill is still classified as hazardous", async () => {
  const result = await runWasteRag({ query: "pill" });
  assert.equal(result.category, "hazardous", `Expected hazardous, got ${result.category}`);
});
