// Compile only the RAG unit-test dependency graph, then use Node's native runner.
// This avoids requiring tsx's OS-user lookup in restricted Windows environments.
import ts from "typescript";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const out = await mkdtemp(path.join(root, ".rag-test-"));
const files = [
  "services/visionAnalysis",
  "services/wasteRag",
  "services/wasteAnalysis",
  "services/wasteSafety",
  "services/wasteRetrieval",
  "data/wasteKnowledgeBase",
  "evaluation/wasteRag.test",
];
try {
  for (const name of files) {
    const source = await readFile(path.join(root, "src", name + ".ts"), "utf8");
    let code = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    code = code.replace(/from "(@\/|\.\.?\/)([^"\n]+)"/g, (_, prefix, rest) => {
      const target =
        prefix === "@/"
          ? path.join(out, rest)
          : path.resolve(out, path.dirname(name), prefix + rest);
      let relative = path
        .relative(path.join(out, path.dirname(name)), target)
        .replaceAll("\\", "/");
      if (!relative.startsWith(".")) relative = "./" + relative;
      return `from "${relative}.js"`;
    });
    const dest = path.join(out, name + ".js");
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, code);
  }
  const result = spawnSync(
    process.execPath,
    ["--test", path.join(out, "evaluation/wasteRag.test.js")],
    { stdio: "inherit" },
  );
  process.exitCode = result.status ?? 1;
} finally {
  // Only the freshly created directory inside this project is removed.
  if (path.dirname(out) !== root || !path.basename(out).startsWith(".rag-test-"))
    throw new Error("Unexpected test directory");
  await rm(out, { recursive: true, force: true });
}
