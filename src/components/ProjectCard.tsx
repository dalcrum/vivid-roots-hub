import Link from "next/link";
import { Project } from "@/lib/types";

const typeIcons: Record<string, string> = {
  "Clean Water": "💧",
  Education: "📚",
  Health: "🏥",
  Infrastructure: "🏗️",
};

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  completed: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-700" },
  in_progress: { label: "In Progress", dot: "bg-amber-500", text: "text-amber-700" },
  planning: { label: "Planning", dot: "bg-sky-500", text: "text-sky-700" },
};

export default function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status] || statusConfig.planning;
  const icon = typeIcons[project.type] || "📋";
  const percentage = project.cost > 0 ? Math.round((project.funded / project.cost) * 100) : 0;

  return (
    <Link href={`/projects/${project.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.hero_image_url ? (
            <img
              src={project.hero_image_url}
              alt={project.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">{icon}</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm">
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              <span className={status.text}>{status.label}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="text-sm text-gray-500 mb-1">
            {icon} {project.type}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            📍 {project.community}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>👥 {project.people_served.toLocaleString()}</span>
            {project.students_impacted > 0 && (
              <span>🎒 {project.students_impacted.toLocaleString()}</span>
            )}
          </div>

          {/* Funding bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full ${percentage >= 100 ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>${project.funded.toLocaleString()} raised</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
