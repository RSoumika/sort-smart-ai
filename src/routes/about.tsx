import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, HelpCircle, Lock, MapPin, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const TITLE = "About & Responsible AI — SortSmart";
const DESCRIPTION =
  "The problem, the solution, SDG alignment and the responsible-AI principles behind the SortSmart waste segregation prototype.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const PRINCIPLES = [
  {
    icon: Lock,
    title: "Privacy",
    copy: "Only information needed to identify the waste should be used. Avoid collecting unnecessary personal information.",
  },
  {
    icon: Eye,
    title: "Transparency",
    copy: "Explain why a particular disposal recommendation was made.",
  },
  {
    icon: HelpCircle,
    title: "Uncertainty",
    copy: "If the system cannot confidently identify an item, it should say so instead of guessing.",
  },
  {
    icon: ShieldCheck,
    title: "Safety",
    copy: "Provide additional caution for hazardous waste and e-waste.",
  },
  {
    icon: MapPin,
    title: "Local context",
    copy: "Disposal systems differ between locations. Users should verify local municipal guidance.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-14">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">SortSmart</h1>
          <p className="mt-3 text-lg text-muted-foreground">AI for smarter waste segregation.</p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="surface-card p-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Problem
            </h2>
            <p className="mt-3 text-base leading-relaxed">
              People often struggle to determine how everyday waste should be disposed of.
            </p>
          </div>
          <div className="surface-card p-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Solution
            </h2>
            <p className="mt-3 text-base leading-relaxed">
              An AI-assisted system that identifies waste categories and provides understandable
              disposal guidance.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">SDG alignment</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-primary-soft p-5">
                <p className="font-display text-base font-semibold text-primary">SDG 12</p>
                <p className="mt-1 text-sm text-primary/85">
                  Responsible Consumption and Production
                </p>
              </div>
              <div className="rounded-2xl bg-recycle-soft p-5">
                <p className="font-display text-base font-semibold text-recycle">SDG 11</p>
                <p className="mt-1 text-sm text-recycle/85">Sustainable Cities and Communities</p>
              </div>
            </div>
          </div>
          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold">Target users</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Students", "Households", "Campus communities", "Sustainability-conscious users"].map(
                (u) => (
                  <li key={u} className="rounded-xl bg-muted/60 px-4 py-3.5 text-sm font-medium">
                    {u}
                  </li>
                ),
              )}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Built as an educational prototype for a project showcase. No real-time municipal
              waste database, partnership or measured impact is claimed.
            </p>
          </div>
        </section>

        <section id="responsible-ai" className="mt-16 scroll-mt-24">
          <h2 className="text-3xl font-semibold">Responsible AI</h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            The principles that shape how SortSmart answers — and when it declines to.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="surface-card p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-primary p-8 text-primary-foreground">
            <p className="font-display text-xl font-semibold leading-relaxed sm:text-2xl">
              SortSmart is an assistance tool, not a substitute for official local
              waste-management instructions.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link
            to="/sort"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Sort an Item <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
