import { createServerSupabase } from "@/lib/supabase-server";
import { Project } from "@/lib/types";
import EditProjectForm from "@/components/admin/EditProjectForm";
import Link from "next/link";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-2">
          Project not found
        </h1>
        <Link
          href="/admin/projects"
          className="text-[var(--brand-sky)] hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  // Count published updates for this project
  const { count } = await supabase
    .from("project_updates")
    .select("*", { count: "exact", head: true })
    .eq("project_id", id)
    .eq("review_status", "published");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to projects
        </Link>
      </div>
      <EditProjectForm
        project={project as Project}
        publishedUpdateCount={count || 0}
      />
    </div>
  );
}
