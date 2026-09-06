import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/sort", label: "Sort Waste" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/impact", label: "Impact" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">SortSmart</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/sort"
            className="ml-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sort an Item
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="block rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
