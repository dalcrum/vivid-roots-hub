import { createServerSupabase } from "@/lib/supabase-server";
import { Project } from "@/lib/types";
import Link from "next/link";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-700" },
  in_progress: { label: "In Progress", bg: "bg-amber-100", text: "text-amber-700" },
  planning: { label: "Planning", bg: "bg-sky-100", text: "text-sky-700" },
};

export default async function AdminProjects() {
  const supabase = await createServerSupabase();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projectList = (projects as Project[]) || [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all your projects.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {projectList.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {projectList.map((project) => {
              const status = statusConfig[project.status] || statusConfig.planning;
              const percentage =
                project.cost > 0
                  ? Math.round((project.funded / project.cost) * 100)
                  : 0;
              return (
                <li key={project.id} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {project.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        📍 {project.community} - {project.type}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>👥 {project.people_served} served</span>
                        <span>
                          💰 ${project.funded.toLocaleString()} / $
                          {project.cost.toLocaleString()} ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-emerald-600 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-xs text-gray-400 hover:underline"
                        target="_blank"
                      >
                        View public page →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
