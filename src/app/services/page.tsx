import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Globe,
  LayoutDashboard,
  Database,
  Sparkles,
  Gauge,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { BRAND_URL, BRAND_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services — hire nihmathullah.com",
  description:
    "NWS Tools is built by nihmathullah.com — a studio that designs and builds premium websites, web apps, custom CRMs and AI products. Work with us.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  { icon: Globe, title: "Websites & landing pages", desc: "Fast, beautiful, conversion-focused marketing sites that load instantly and rank well." },
  { icon: LayoutDashboard, title: "Web apps & dashboards", desc: "Full-stack products and admin dashboards — auth, data, real-time, the works." },
  { icon: Database, title: "Custom CRMs & internal tools", desc: "Bespoke CRMs and internal software tailored to exactly how your team works." },
  { icon: Sparkles, title: "AI-powered products", desc: "Assistants, automations and AI features wired into real, production-grade apps." },
];

const POINTS = [
  { icon: Gauge, title: "Genuinely fast", desc: "The same performance obsession behind these tools, applied to your product." },
  { icon: ShieldCheck, title: "Private & secure by default", desc: "Built with security and your users' privacy as a first principle, not an afterthought." },
  { icon: Wrench, title: "Engineered to last", desc: "Clean, maintainable code you actually own — no lock-in, no throwaway prototypes." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      {/* Hero */}
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
        Built by nihmathullah.com
      </div>
      <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        These tools are free. Your next product{" "}
        <span className="text-accent">deserves the same craft.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        NWS Tools is built by <a href={BRAND_URL} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-accent/40 underline-offset-2">nihmathullah.com</a> — a
        studio that designs and builds premium websites, web apps and custom CRMs. If you
        need software built properly, let&apos;s talk.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={BRAND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg shadow-sm shadow-accent/25 transition hover:brightness-110"
        >
          {BRAND_CTA} <ArrowUpRight className="h-4 w-4" />
        </a>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-panel-raised"
        >
          Start a project
        </Link>
      </div>

      {/* Services */}
      <h2 className="mt-16 text-lg font-semibold tracking-tight">What we build</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="panel p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Why us */}
      <h2 className="mt-16 text-lg font-semibold tracking-tight">Why work with us</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="panel p-5">
              <Icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-panel p-8 text-center sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute"
        />
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-fg-muted">
          Tell us what you&apos;re building. We reply fast, and we love a good challenge.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={BRAND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition hover:brightness-110"
          >
            {BRAND_CTA} <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link href="/contact" className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-panel-raised">
            Contact
          </Link>
        </div>
        <ul className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fg-muted">
          {["Websites", "Web apps", "CRMs", "AI products"].map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-accent" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
