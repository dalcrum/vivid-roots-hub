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
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            📍 {project.community}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>👥 {project.people_served.toLocaleString()} people impacted</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
