import { Project } from "@/lib/types";

const typeIcons: Record<string, string> = {
  "Clean Water": "💧",
  Education: "📚",
  Health: "🏥",
  Infrastructure: "🏗️",
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-800" },
  in_progress: { label: "In Progress", bg: "bg-amber-100", text: "text-amber-800" },
  planning: { label: "Planning", bg: "bg-sky-100", text: "text-sky-800" },
};

export default function ProjectHero({ project }: { project: Project }) {
  const status = statusConfig[project.status] || statusConfig.planning;
  const icon = typeIcons[project.type] || "📋";

  return (
    <section className="relative h-[280px] md:h-[420px] w-full overflow-hidden pb-16">
      {project.hero_image_url && (
        <img
          src={project.hero_image_url}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {status.label}
          </span>
          <span className="text-white/80 text-sm">
            {icon} {project.type}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
          {project.title}
        </h1>
        <p className="text-white/80 text-lg">
          📍 {project.community}, {project.region}
        </p>
      </div>
    </section>
  );
}
