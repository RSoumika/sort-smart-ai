import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Sparkles, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { WasteResult } from "@/components/WasteResult";
import { LocalGuidanceDialog } from "@/components/LocalGuidanceDialog";
import { LocalRulesNotice } from "@/components/SafetyNotice";
import { EXAMPLE_ITEMS } from "@/data/wasteKnowledgeBase";
import {
  analyzeWasteImage,
  analyzeWasteItem,
  type AnalysisResult,
} from "@/services/wasteAnalysis";

const TITLE = "Sort Waste — SortSmart";
const DESCRIPTION =
  "Describe or photograph an item and SortSmart suggests the likely waste category, disposal method and safety guidance.";

export const Route = createFileRoute("/sort")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SortPage,
});

type Mode = "text" | "image";

function SortPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function runText(value: string) {
    if (!value.trim()) {
      setError("Please describe the item you want to sort.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await analyzeWasteItem(value));
    } catch {
      setError("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function runImage() {
    if (!file) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await analyzeWasteImage(file.name, query));
    } catch {
      setError("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setQuery("");
    setFile(null);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-14">
        <header className="text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">What are you throwing away?</h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Tell SortSmart what you have and we'll help you figure out what to do with it.
          </p>
        </header>

        <div className="mt-10 space-y-6">
          {!result && !loading && (
            <div className="surface-card p-6 sm:p-8">
              <div
                role="tablist"
                aria-label="Input method"
                className="inline-flex rounded-full bg-muted p-1"
              >
                {(["text", "image"] as const).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={mode === m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      mode === m
                        ? "bg-card text-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "text" ? "Describe it" : "Upload a photo"}
                  </button>
                ))}
              </div>

              {mode === "text" ? (
                <form
                  className="mt-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void runText(query);
                  }}
                >
                  <label htmlFor="item" className="sr-only">
                    Item description
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <input
                        id="item"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. used battery, banana peel, plastic bottle..."
                        className="w-full rounded-2xl border border-input bg-background py-4 pl-11 pr-4 text-base outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Sparkles className="size-4" aria-hidden /> Analyze Item
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 space-y-4">
                  <ImageUploader
                    file={file}
                    previewUrl={previewUrl}
                    onSelect={setFile}
                    onClear={() => setFile(null)}
                  />
                  <div>
                    <label htmlFor="hint" className="text-sm font-medium">
                      Short description (recommended)
                    </label>
                    <input
                      id="hint"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="What does the photo show?"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Image recognition is not connected in this prototype — the interface and
                      service layer are ready for a vision model, so a description is used to
                      classify for now.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!file}
                    onClick={() => void runImage()}
                    className="w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Analyze Photo
                  </button>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" aria-hidden /> {error}
                </p>
              )}

              <div className="mt-8">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Try an example
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {EXAMPLE_ITEMS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setMode("text");
                        setQuery(item);
                        void runText(item);
                      }}
                      className="rounded-full border border-border bg-background px-3.5 py-2 text-sm transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <LocalRulesNotice className="mt-6" />
            </div>
          )}

          {loading && <AnalysisLoader />}

          {result && !loading && (
            <WasteResult result={result} onReset={reset} onFindLocal={() => setLocalOpen(true)} />
          )}
        </div>
      </main>

      <LocalGuidanceDialog open={localOpen} onClose={() => setLocalOpen(false)} />
      <Footer />
    </div>
  );
}
