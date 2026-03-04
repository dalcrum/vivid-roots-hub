import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Language } from "@/lib/translations";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's preferred language
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_language")
    .eq("id", user.id)
    .single();

  const userLang: Language = (profile?.preferred_language as Language) || "en";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        userEmail={user.email || null}
        userLang={userLang}
      />
      <main className="flex-1 bg-gray-50 p-4 md:p-8 pt-16 md:pt-8">{children}</main>
    </div>
  );
}
