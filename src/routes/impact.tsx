import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryIconTile } from "@/components/CategoryBadge";
import { CATEGORIES, type WasteCategory } from "@/data/wasteKnowledgeBase";

const TITLE = "Impact Dashboard — SortSmart";
const DESCRIPTION =
  "Illustrative prototype metrics showing how SortSmart could reduce incorrect sorting and improve e-waste awareness.";

export const Route = createFileRoute("/impact")({
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
  component: ImpactPage,
});

const METRICS = [
  { label: "Items Sorted", value: "128" },
  { label: "Correct Guidance Provided", value: "91%" },
  { label: "E-waste Identified", value: "24" },
  { label: "Potentially Diverted from General Waste", value: "73" },
];

const BREAKDOWN: { id: WasteCategory; count: number; bar: string }[] = [
  { id: "biodegradable", count: 46, bar: "bg-bio" },
  { id: "recyclable", count: 38, bar: "bg-recycle" },
  { id: "ewaste", count: 24, bar: "bg-ewaste" },
  { id: "hazardous", count: 20, bar: "bg-hazard" },
];

const MAX = Math.max(...BREAKDOWN.map((b) => b.count));

function ImpactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-14">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-hazard-soft px-3.5 py-1.5 text-xs font-semibold text-hazard">
            <Info className="size-3.5" aria-hidden /> Demo data · Illustrative prototype metrics
          </span>
          <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Impact dashboard</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            The numbers below are mock demo values used to show what a deployed version of
            SortSmart could report. They are not measured results, and no real users, municipal
            partners or recycling facilities are involved.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="surface-card p-6">
              <p className="font-display text-4xl font-semibold text-primary">{m.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                Demo data
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">Example categories analysed</h2>
            <p className="mt-1 text-sm text-muted-foreground">Illustrative distribution.</p>
            <div className="mt-8 space-y-5">
              {BREAKDOWN.map((b) => (
                <div key={b.id} className="flex items-center gap-4">
                  <CategoryIconTile category={b.id} className="size-10 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{CATEGORIES[b.id].short}</span>
                      <span className="text-muted-foreground">{b.count}</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${b.bar}`}
                        style={{ width: `${(b.count / MAX) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">Potential impact</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              By making waste segregation easier to understand, SortSmart aims to reduce incorrect
              sorting, improve recycling awareness, and encourage safer disposal of e-waste and
              hazardous materials.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Fewer contaminated recycling batches from confused sorting.",
                "More e-waste routed to authorised collection instead of household bins.",
                "Clearer reasoning, so people remember the rule next time.",
              ].map((t) => (
                <li key={t} className="flex gap-3 rounded-xl bg-muted/60 p-3.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Aspirations, not measured outcomes. Any real evaluation would need field data and
              collaboration with local waste authorities.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
