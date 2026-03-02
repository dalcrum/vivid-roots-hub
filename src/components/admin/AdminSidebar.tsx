"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { bilingualLabel, type Language } from "@/lib/translations";
import BilingualText from "./BilingualText";

const navKeys = [
  { href: "/admin", key: "dashboard" as const, icon: "📊" },
  { href: "/admin/projects", key: "projects" as const, icon: "📁" },
  { href: "/admin/updates/new", key: "newUpdate" as const, icon: "📝" },
  { href: "/admin/team", key: "team" as const, icon: "👥" },
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const signOutLabel = bilingualLabel("signOut", userLang);

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <div>
            <span className="text-lg font-bold">Vivid Roots</span>
            <span className="block text-xs text-gray-400">
              {userLang === "es" ? "Portal del Equipo" : "Team Portal"}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navKeys.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const bl = bilingualLabel(item.key, userLang);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <BilingualText
                    primary={bl.primary}
                    subtitle={bl.subtitle}
                    className={isActive ? "" : ""}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">
            {userEmail?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <BilingualText
            primary={signOutLabel.primary}
            subtitle={signOutLabel.subtitle}
          />
        </button>
        <Link
          href="/"
          className="block mt-1 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {userLang === "es" ? (
            <BilingualText primary="Ver sitio público" subtitle="View public site" />
          ) : (
            "View public site"
          )}
        </Link>
      </div>
    </aside>
  );
}
