import { useState } from "react";
import { X } from "lucide-react";

export function LocalGuidanceDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="local-guidance-title"
      onClick={onClose}
    >
      <div
        className="surface-card rise-in w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="local-guidance-title" className="font-display text-xl font-semibold">
            Find local guidance
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-primary-soft p-4 text-sm text-primary">
              Location noted: <strong>{city || "—"}</strong>
              {country ? `, ${country}` : ""}.
            </div>
            <p className="text-sm text-muted-foreground">
              In a production version, SortSmart would query a municipal waste knowledge source
              for this location and return the local bin colours, collection days and drop-off
              points. This prototype does not connect to any municipal database, so please check
              your local authority's website for the official rules.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Got it
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="lg-country" className="text-sm font-medium">
                Country
              </label>
              <input
                id="lg-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="lg-city" className="text-sm font-medium">
                City / municipality
              </label>
              <input
                id="lg-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Prototype: no municipal data source is connected. Your input is only used on this
              screen and is not stored or sent anywhere.
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
