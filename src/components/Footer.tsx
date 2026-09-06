import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold">SortSmart</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            An educational prototype that helps people identify, sort and dispose of everyday
            waste responsibly. Guidance is general and not a substitute for official local
            waste-management instructions.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sort" className="hover:text-foreground">Sort Waste</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
            <li><Link to="/impact" className="hover:text-foreground">Impact Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Project</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/about" hash="responsible-ai" className="hover:text-foreground">Responsible AI</Link></li>
            <li>SDG 12 &amp; SDG 11</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
          Prototype project — no real-time municipal waste database is connected. Metrics shown in
          the dashboard are illustrative demo data.
        </p>
      </div>
    </footer>
  );
}
