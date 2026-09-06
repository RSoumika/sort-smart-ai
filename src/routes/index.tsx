import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ScanSearch,
  SlidersHorizontal,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryIconTile } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/data/wasteKnowledgeBase";

const TITLE = "SortSmart — Know where it goes";
const DESCRIPTION =
  "An AI-powered waste assistant that helps students, households and campuses identify, sort and dispose of everyday waste responsibly.";

export const Route = createFileRoute("/")({
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
  component: Home,
});

const FEATURES = [
  { icon: ScanSearch, title: "Identify", copy: "Understand what type of waste you're dealing with." },
  {
    icon: SlidersHorizontal,
    title: "Sort",
    copy: "Get a clear recommendation for the appropriate disposal category.",
  },
  { icon: BookOpen, title: "Learn", copy: "Understand why correct disposal matters." },
  {
    icon: ShieldCheck,
    title: "Act Responsibly",
    copy: "Get safer guidance for e-waste and hazardous items.",
  },
];

const PROBLEM_FLOW = ["Uncertainty", "Incorrect Sorting", "Contaminated Waste", "Reduced Recycling"];
const SOLUTION_FLOW = ["Question", "Classification", "Guidance", "Action"];

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="grain-bg">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="rise-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" aria-hidden /> Prototype · SDG 12 &amp; SDG 11
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Know where it goes.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                An AI-powered waste assistant that helps you identify, sort, and dispose of
                everyday waste responsibly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/sort"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Sort an Item <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  How It Works
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Designed to make responsible waste segregation simpler.
              </p>
            </div>

            <div className="rise-in grid gap-4 sm:grid-cols-2">
              {(["biodegradable", "recyclable", "hazardous", "ewaste"] as const).map((id, i) => {
                const cat = CATEGORIES[id];
                return (
                  <div
                    key={id}
                    className="surface-card p-5 transition-transform hover:-translate-y-1"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <CategoryIconTile category={id} />
                    <h2 className="mt-4 font-display text-base font-semibold">{cat.label}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="surface-card p-6 transition-transform hover:-translate-y-1">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="surface-card p-8 sm:p-12">
            <h2 className="text-3xl font-semibold">Why SortSmart?</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              People often want to dispose of waste correctly but aren't sure where different items
              belong. Incorrect segregation can contaminate recyclable or compostable waste and
              create safety risks for hazardous materials and e-waste.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <Flow title="What usually happens" items={PROBLEM_FLOW} tone="problem" />
              <Flow title="What SortSmart turns it into" items={SOLUTION_FLOW} tone="solution" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Flow({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "problem" | "solution";
}) {
  const chip =
    tone === "problem"
      ? "bg-hazard-soft text-hazard"
      : "bg-primary-soft text-primary";
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ol className="mt-4 flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-2">
            <span className={`rounded-full px-3.5 py-2 text-sm font-medium ${chip}`}>{item}</span>
            {i < items.length - 1 && (
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
