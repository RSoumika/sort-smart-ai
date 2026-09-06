import { Link } from "@tanstack/react-router";
import { ArrowRight, Info, Lightbulb, RotateCcw, MapPinned } from "lucide-react";
import { CategoryBadge, CategoryIconTile } from "@/components/CategoryBadge";
import { SafetyNotice, LocalRulesNotice } from "@/components/SafetyNotice";
import { CONFIDENCE_COPY, type AnalysisResult } from "@/services/wasteAnalysis";

const BAR_COLOR = {
  high: "bg-bio",
  medium: "bg-hazard",
  low: "bg-unknown",
} as const;

export function WasteResult({
  result,
  onReset,
  onFindLocal,
}: {
  result: AnalysisResult;
  onReset: () => void;
  onFindLocal: () => void;
}) {
  const confidence = CONFIDENCE_COPY[result.confidence];

  return (
    <article className="surface-card rise-in overflow-hidden">
      <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <CategoryIconTile category={result.category} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Identified item
            </p>
            <h2 className="font-display text-2xl font-semibold">{result.itemName}</h2>
          </div>
        </div>
        <CategoryBadge category={result.category} />
      </div>

      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-5">
        <div className="space-y-6 md:col-span-3">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Likely material
            </h3>
            <p className="mt-2 text-base leading-relaxed">{result.material}</p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended action
            </h3>
            <p className="mt-2 text-base leading-relaxed">{result.recommendedAction}</p>
          </section>

          {result.specialHandling && <SafetyNotice>{result.specialHandling}</SafetyNotice>}

          {result.clarificationQuestion && (
            <section className="rounded-xl border border-border bg-muted/50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                A little more detail would help
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{result.clarificationQuestion}</p>
            </section>
          )}

          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Lightbulb className="size-3.5" aria-hidden /> Why it matters
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>
          </section>
        </div>

        <aside className="space-y-5 rounded-2xl bg-muted/60 p-5 md:col-span-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Confidence
            </h3>
            <p className="mt-1.5 font-display text-lg font-semibold">{confidence.label}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${BAR_COLOR[result.confidence]}`}
                style={{ width: `${confidence.pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{confidence.note}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Indicative only — not a calibrated probability.
            </p>
          </div>

          {result.requiresVerification && (
            <div className="flex items-start gap-2 rounded-xl bg-background p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Please verify with your local disposal guidelines before acting.
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">
            Source: {result.source === "local-knowledge-base" ? "local knowledge base" : "local material reasoning"} ({result.inputType} input). No municipal database is connected in this prototype.
          </p>
        </aside>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RotateCcw className="size-4" aria-hidden /> Sort Another Item
          </button>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Learn More <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={onFindLocal}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <MapPinned className="size-4" aria-hidden /> Find Local Guidance
          </button>
        </div>
        <LocalRulesNotice className="sm:max-w-xs" />
      </div>
    </article>
  );
}
