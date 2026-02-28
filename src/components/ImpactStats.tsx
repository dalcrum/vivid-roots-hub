import { Project } from "@/lib/types";

export default function ImpactStats({ project }: { project: Project }) {
  const stats = [
    {
      icon: "👥",
      value: project.people_served.toLocaleString(),
      label: "People Served",
    },
    {
      icon: "🎒",
      value: project.students_impacted.toLocaleString(),
      label: "Students Impacted",
    },
    {
      icon: "💰",
      value: `$${project.cost.toLocaleString()}`,
      label: "Project Cost",
    },
    {
      icon: "📅",
      value: project.completed_at
        ? new Date(project.completed_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : project.started_at
          ? new Date(project.started_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "TBD",
      label: project.completed_at ? "Completed" : "Started",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-8 -mt-12 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-md p-5 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
