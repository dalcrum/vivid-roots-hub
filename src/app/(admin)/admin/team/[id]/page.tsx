import { createServerSupabase } from "@/lib/supabase-server";
import { Profile } from "@/lib/types";
import EditMemberForm from "@/components/admin/EditMemberForm";
import Link from "next/link";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single<Profile>();

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-[var(--brand-navy)] mb-2">
          Team member not found
        </h1>
        <Link href="/admin/team" className="text-[var(--brand-sky)] hover:underline">
          Back to Team
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <EditMemberForm profile={profile} />
    </div>
  );
}
