import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Analyzing your item...",
  "Identifying waste type...",
  "Checking disposal guidance...",
];

export function AnalysisLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="surface-card rise-in p-8" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
        <p className="font-display text-lg font-semibold">{STEPS[step]}</p>
      </div>
      <ul className="mt-6 space-y-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span
              className={
                i <= step
                  ? "size-2.5 rounded-full bg-primary"
                  : "size-2.5 rounded-full bg-border"
              }
            />
            <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
