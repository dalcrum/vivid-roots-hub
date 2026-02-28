import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={user.email || null} />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
