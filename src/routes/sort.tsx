import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { WasteResult } from "@/components/WasteResult";
import { LocalGuidanceDialog } from "@/components/LocalGuidanceDialog";
import { LocalRulesNotice } from "@/components/SafetyNotice";
import { EXAMPLE_ITEMS } from "@/data/wasteKnowledgeBase";
import { type AnalysisResult } from "@/services/wasteAnalysis";
import { analyzeWithRag } from "@/services/wasteRagServer";

const TITLE = "Sort Waste — SortSmart";
const DESCRIPTION =
  "Describe an item and SortSmart suggests the likely waste category, disposal method and safety guidance.";

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

function SortPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localOpen, setLocalOpen] = useState(false);

  async function runText(value: string) {
    if (!value.trim()) {
      setError("Please describe the item you want to sort.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await analyzeWithRag({ data: { query: value, inputType: "text" } }));
    } catch {
      setError("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  function reset() {
    setResult(null);
    setQuery("");
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
                      maxLength={500}
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

              <p className="mt-5 text-xs text-muted-foreground">
                Descriptions are sent to OpenAI to explain retrieved guidance when AI is configured.
                Avoid personal or sensitive information.
              </p>
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
