import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryIconTile } from "@/components/CategoryBadge";
import { CATEGORIES, type WasteCategory } from "@/data/wasteKnowledgeBase";

const TITLE = "How It Works — SortSmart";
const DESCRIPTION =
  "From input to recommendation: how SortSmart identifies an item, checks its waste knowledge base and returns disposal guidance.";

export const Route = createFileRoute("/how-it-works")({
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
  component: HowItWorks,
});

const STEPS = [
  { n: "01", title: "Tell Us", copy: "Enter an item name, description, or photo." },
  { n: "02", title: "Identify", copy: "SortSmart determines the likely material and waste category." },
  {
    n: "03",
    title: "Check Guidance",
    copy: "The system retrieves relevant disposal guidance from its knowledge base.",
  },
  {
    n: "04",
    title: "Take Action",
    copy: "You receive a clear disposal recommendation and explanation.",
  },
];

const PIPELINE = [
  "User Input",
  "AI / Classification Layer",
  "Waste Knowledge Base",
  "Disposal Recommendation",
  "Explanation + Safety Guidance",
];

const ORDER: WasteCategory[] = ["biodegradable", "recyclable", "hazardous", "ewaste"];

function HowItWorks() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-14">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">How SortSmart works</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Four simple steps, one transparent pipeline. In this prototype the classification layer
            runs locally with normalisation and keyword/fuzzy matching — no external AI model is
            connected.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="surface-card p-6 transition-transform hover:-translate-y-1">
              <span className="font-display text-3xl font-semibold text-primary/35">{s.n}</span>
              <h2 className="mt-3 font-display text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">Technical architecture</h2>
            <ol className="mt-6 space-y-2">
              {PIPELINE.map((node, i) => (
                <li key={node}>
                  <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium">
                    {node}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-muted-foreground">
              The classification layer sits behind a single service function
              (<code className="rounded bg-muted px-1 py-0.5">analyzeWasteItem</code>), so a real
              AI or vision API can replace the local logic without changing the UI. Any API key
              would live server-side, never in the browser.
            </p>
          </div>

          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">The four waste categories</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Items that don't fit cleanly return “Needs more information” instead of a guess.
            </p>
            <div className="mt-6 space-y-5">
              {ORDER.map((id) => {
                const c = CATEGORIES[id];
                return (
                  <div key={id} className="flex gap-4">
                    <CategoryIconTile category={id} />
                    <div>
                      <h3 className="font-display text-base font-semibold">{c.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.examples.join(" · ")}
                      </p>
                      <p className="mt-1 text-sm">{c.generalRecommendation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-12">
          <Link
            to="/sort"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Try it now <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
