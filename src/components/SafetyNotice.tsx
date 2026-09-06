import { MapPin, ShieldAlert } from "lucide-react";

export function LocalRulesNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs text-muted-foreground ${className}`}>
      <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      SortSmart provides general guidance. Disposal rules may differ by municipality.
    </p>
  );
}

export function SafetyNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-hazard-soft p-4 text-sm text-hazard">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
