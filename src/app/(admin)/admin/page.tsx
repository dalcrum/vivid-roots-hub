import { createServerSupabase } from "@/lib/supabase-server";
import { Project, ProjectUpdate } from "@/lib/types";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  // Fetch all projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projectList = (projects as Project[]) || [];

  // Fetch recent updates
  const { data: updates } = await supabase
    .from("project_updates")
    .select("*, projects(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentUpdates = (updates as (ProjectUpdate & { projects: { title: string } })[]) || [];

  // Calculate stats
  const totalProjects = projectList.length;
  const completedProjects = projectList.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressProjects = projectList.filter(
    (p) => p.status === "in_progress"
  ).length;
  const totalServed = projectList.reduce(
    (sum, p) => sum + p.people_served,
    0
  );

  const stats = [
    { label: "Total Projects", value: totalProjects.toString(), icon: "📁" },
    { label: "Completed", value: completedProjects.toString(), icon: "✅" },
    { label: "In Progress", value: inProgressProjects.toString(), icon: "🔨" },
    {
      label: "People Served",
      value: totalServed.toLocaleString(),
      icon: "👥",
    },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here&apos;s an overview of your projects.
          </p>
        </div>
        <Link
          href="/admin/updates/new"
          className="bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
        >
          + New Update
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/updates/new"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700">
            Submit Field Update
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Add a new update with photos and stories from the field.
          </p>
        </Link>
        <Link
          href="/admin/projects"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="text-3xl mb-2">📁</div>
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700">
            Manage Projects
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View, edit, and manage all your projects.
          </p>
        </Link>
      </div>

      {/* Recent updates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
        </div>
        {recentUpdates.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentUpdates.map((update) => (
              <li key={update.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {update.projects?.title || "Unknown Project"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {update.personal_story_name
                      ? `Story: ${update.personal_story_name}`
                      : "Field update"}
                    {" - "}
                    {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    update.review_status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : update.review_status === "in_review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {update.review_status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No updates yet. Submit your first field update!</p>
          </div>
        )}
      </div>
    </div>
  );
}
