"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Sticky public-site nav used on non-homepage routes
 * (currently /impact, /projects/[id]).
 *
 * Brand-refresh (2026): matches the homepage visual language —
 *   - navy background w/ translucent blur
 *   - horizontal wordmark logo (white on transparent)
 *   - gold "Give Hope" CTA linking to Givebutter
 *   - collapses to wordmark + mobile drawer below 720px
 */

const navLinks = [
  { href: "/boise-walks-for-water", label: "Walk for Water" },
  { href: "/impact", label: "Impact" },
];
const GIVEBUTTER_URL = "https://givebutter.com/vividroots";
const LOGO_LIGHT = "/images/logo-wordmark-white.png";

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--brand-navy)]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[80px] md:h-[96px] flex items-center justify-between gap-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Vivid Roots Collective — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_LIGHT}
            alt="Vivid Roots — Live Vividly"
            className="h-[48px] md:h-[64px] w-auto"
          />
        </Link>

        {/* Desktop links + CTA */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[var(--brand-sky-light)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={GIVEBUTTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-gold-bright)] px-5 py-2.5 text-sm font-medium text-[var(--brand-navy)] transition-transform hover:-translate-y-0.5"
          >
            Give Hope <span className="text-xs opacity-60">$30</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-white/85 hover:text-white"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[var(--brand-navy)] px-6 py-5">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-base ${
                    isActive
                      ? "text-[var(--brand-sky-light)]"
                      : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={GIVEBUTTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand-gold-bright)] px-5 py-3 text-sm font-medium text-[var(--brand-navy)]"
            >
              Give Hope <span className="text-xs opacity-60">$30</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
