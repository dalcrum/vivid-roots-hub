import { createServerSupabase } from "@/lib/supabase-server";
import { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact | Vivid Roots Collective",
  description:
    "Explore our projects and see the real impact of your support in Guatemala and Ecuador.",
};

export default async function ImpactPage() {
  const supabase = await createServerSupabase();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projectList = (projects as Project[]) || [];

  // Calculate totals for the stats banner
  const totalServed = projectList.reduce(
    (sum, p) => sum + p.people_served,
    0
  );
  const uniqueCommunities = new Set(
    projectList.map((p) => p.community).filter(Boolean)
  ).size;
  const completedCount = projectList.filter(
    (p) => p.status === "completed"
  ).length;
  const activeCount = projectList.filter(
    (p) => p.status === "in_progress"
  ).length;

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-brand-primary-dark to-brand-primary py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl text-white mb-3">Our Impact</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every project tells a story. Explore the communities we partner with
            and see the impact of your support.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: "👥",
              value: totalServed.toLocaleString(),
              label: "People Impacted",
            },
            {
              icon: "🏘️",
              value: uniqueCommunities.toString(),
              label: "Communities Reached",
            },
            {
              icon: "🚀",
              value: activeCount.toString(),
              label: "Active Projects",
            },
            {
              icon: "✅",
              value: completedCount.toString(),
              label: "Projects Completed",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-5 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-brand-dark font-stats">
                {stat.value}
              </div>
              <div className="text-sm text-brand-gray">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Project grid */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <h2 className="font-heading text-2xl text-brand-dark mb-6">
          Our Projects
        </h2>
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-brand-gray text-lg">No projects yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
