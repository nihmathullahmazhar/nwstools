"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/tools/registry";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeColorMenu } from "@/components/theme-color-menu";
import { BRAND_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/tools", label: "All tools" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/tools"
      ? pathname.startsWith("/tools") || pathname.startsWith("/category")
      : pathname === href;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    function onSearch() {
      setPaletteOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("toolkit:search", onSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("toolkit:search", onSearch);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors",
          scrolled ? "border-border bg-bg/80 backdrop-blur-xl" : "border-transparent bg-bg",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
              <span className="text-[15px] font-black">N</span>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              NWS <span className="text-fg-muted">Tools</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <nav className="mr-1 hidden items-center gap-0.5 text-sm md:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "rounded-lg px-3 py-2 transition-colors",
                    isActive(n.href) ? "font-medium text-accent" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <a
              href={BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-1 hidden h-9 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-accent-fg transition hover:brightness-110 sm:inline-flex"
            >
              Hire us
            </a>

            <button
              onClick={() => setPaletteOpen(true)}
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-panel-raised hover:text-fg"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <ThemeColorMenu />
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-panel-raised md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-bg px-4 py-3 md:hidden">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-faint">
              Categories
            </div>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-lg px-3 py-2 text-sm text-fg-muted hover:bg-panel-raised hover:text-fg"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-3 text-sm">
              {[
                { href: "/tools", label: "All tools" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/contact", label: "Contact" },
              ].map((n) => (
                <Link key={n.href} href={n.href} className="text-fg-muted hover:text-fg">
                  {n.label}
                </Link>
              ))}
            </div>
            <a
              href={BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-accent text-sm font-medium text-accent-fg"
            >
              Hire us — nihmathullah.com
            </a>
          </div>
        )}
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
