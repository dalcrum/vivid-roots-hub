"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/impact", label: "Impact" },
];

const GIVEBUTTER_URL = "https://givebutter.com/vividroots";

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--brand-primary-deep)]/[0.88] backdrop-blur-[12px] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-white.png"
            alt="Vivid Roots Collective"
            width={34}
            height={40}
            className="object-contain"
          />
          <span className="font-heading text-[17px] text-white tracking-[0.2px]">
            Vivid Roots Collective
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium tracking-[0.2px] transition-colors duration-200 ${
                  isActive
                    ? "text-brand-accent"
                    : "text-white/80 hover:text-brand-accent"
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
            className="bg-brand-secondary text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-brand-secondary-light"
          >
            Donate
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--brand-primary-deep)] border-t border-white/10 px-6 py-5">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive ? "text-brand-accent" : "text-white/80"
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
              className="bg-brand-secondary text-white text-[14px] font-semibold px-5 py-3 rounded-lg text-center mt-2"
            >
              Donate
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
