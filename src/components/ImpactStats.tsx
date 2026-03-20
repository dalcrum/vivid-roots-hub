import { Project } from "@/lib/types";

export default function ImpactStats({ project }: { project: Project }) {
  const stats = [
    {
      icon: "👥",
      value: project.people_served.toLocaleString(),
      label: "People Impacted",
    },
    {
      icon: "🏘️",
      value: project.community_population
        ? project.community_population.toLocaleString()
        : project.community || "—",
      label: project.community_population ? "Community Size" : "Community",
    },
    {
      icon: "📍",
      value: project.region || project.community || "Guatemala",
      label: "Region",
    },
    {
      icon: "📅",
      value: project.status === "completed"
        ? project.completed_at
          ? new Date(project.completed_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "Completed"
        : project.status === "in_progress"
          ? "In Progress"
          : "Planning",
      label: "Status",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-md p-5 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-brand-dark font-stats">{stat.value}</div>
            <div className="text-sm text-brand-gray">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
