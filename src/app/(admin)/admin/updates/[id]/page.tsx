import { createServerSupabase } from "@/lib/supabase-server";
import { ProjectUpdate, UpdatePhoto } from "@/lib/types";
import ReviewUpdatePanel from "@/components/admin/ReviewUpdatePanel";
import Link from "next/link";

export default async function ReviewUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // Fetch update with project info
  const { data: update } = await supabase
    .from("project_updates")
    .select("*, projects(title, community, region, type)")
    .eq("id", id)
    .single();

  if (!update) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-2">
          Update not found
        </h1>
        <Link
          href="/admin/updates"
          className="text-[var(--brand-sky)] hover:underline"
        >
          Back to updates
        </Link>
      </div>
    );
  }

  // Fetch photos
  const { data: photos } = await supabase
    .from("update_photos")
    .select("*")
    .eq("update_id", id);

  const project = update.projects as {
    title: string;
    community: string;
    region: string;
    type: string;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <Link
          href="/admin/updates"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to all updates
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-navy)]">
          {project.title}
        </h1>
        <p className="text-gray-500 text-sm">
          📍 {project.community}, {project.region} • {project.type} •
          Submitted{" "}
          {new Date(update.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <ReviewUpdatePanel
        update={update as ProjectUpdate}
        photos={(photos as UpdatePhoto[]) || []}
      />
    </div>
  );
}
