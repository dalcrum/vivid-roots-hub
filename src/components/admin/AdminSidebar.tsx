"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { bilingualLabel, type Language } from "@/lib/translations";
import BilingualText from "./BilingualText";

/**
 * Admin sidebar — 2026 brand refresh.
 *
 * Matches the public brand: navy background, horizontal wordmark logo,
 * gold accent for the active item, sky-light hover state on inactive
 * items. Layout + nav structure unchanged from the previous version.
 */

const navKeys = [
  { href: "/admin", key: "dashboard" as const, icon: "📊" },
  { href: "/admin/projects", key: "projects" as const, icon: "📁" },
  { href: "/admin/updates/new", key: "newUpdate" as const, icon: "📝" },
  { href: "/admin/updates", key: "reviewUpdates" as const, icon: "👀" },
  { href: "/admin/team", key: "team" as const, icon: "👥" },
  { href: "/admin/fundraising", key: "fundraising" as const, icon: "💚" },
  { href: "/admin/donors", key: "donors" as const, icon: "🤝" },
];

export default function AdminSidebar({
  userEmail,
  userLang = "en",
}: {
  userEmail: string | null;
  userLang?: Language;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const signOutLabel = bilingualLabel("signOut", userLang);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-[var(--brand-navy)] p-3 text-white shadow-lg"
        aria-label="Open menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-[var(--brand-navy)] text-white min-h-screen flex flex-col
          fixed md:sticky top-0 z-40
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button (mobile) */}
        <div className="md:hidden flex justify-end p-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/60 hover:text-white p-2"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wordmark + portal label */}
        <div className="px-6 pt-5 pb-6 border-b border-white/10">
          <Link href="/admin" className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-wordmark-white.png"
              alt="Vivid Roots — Live Vividly"
              className="h-12 w-auto"
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--brand-sky-light)]/80">
              {userLang === "es" ? "Portal del Equipo" : "Team Portal"}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navKeys.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : item.href === "/admin/updates"
                    ? pathname === "/admin/updates" ||
                      (pathname.startsWith("/admin/updates/") &&
                        pathname !== "/admin/updates/new")
                    : pathname.startsWith(item.href);
              const bl = bilingualLabel(item.key, userLang);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--brand-sky)]/20 text-[var(--brand-sky-light)] ring-1 ring-inset ring-[var(--brand-sky-light)]/30"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <BilingualText
                      primary={bl.primary}
                      subtitle={bl.subtitle}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-sky)] flex items-center justify-center text-sm font-bold text-[var(--brand-navy)]">
              {userEmail?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <BilingualText
              primary={signOutLabel.primary}
              subtitle={signOutLabel.subtitle}
            />
          </button>
          <Link
            href="/"
            className="block mt-1 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {userLang === "es" ? (
              <BilingualText
                primary="Ver sitio público"
                subtitle="View public site"
              />
            ) : (
              "View public site"
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
