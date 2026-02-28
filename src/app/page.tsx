import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projectList = (projects as Project[]) || [];

  // Calculate totals for the stats banner
  const totalServed = projectList.reduce((sum, p) => sum + p.people_served, 0);
  const totalStudents = projectList.reduce((sum, p) => sum + p.students_impacted, 0);
  const totalFunded = projectList.reduce((sum, p) => sum + p.funded, 0);
  const completedCount = projectList.filter((p) => p.status === "completed").length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            Project Hub
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Every project tells a story. Explore the communities we serve and see
            the impact of your support.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-5xl mx-auto px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "👥", value: totalServed.toLocaleString(), label: "People Served" },
            { icon: "🎒", value: totalStudents.toLocaleString(), label: "Students Impacted" },
            { icon: "💰", value: `$${totalFunded.toLocaleString()}`, label: "Total Funded" },
            { icon: "✅", value: completedCount.toString(), label: "Projects Completed" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Project grid */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Projects</h2>
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No projects yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
