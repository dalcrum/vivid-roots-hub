import { Project } from "@/lib/types";

export default function CommunityContext({ project }: { project: Project }) {
  if (!project.community_context) return null;

  return (
    <section className="max-w-5xl mx-auto px-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        About the Community
      </h2>
      <div className="bg-gray-50 rounded-xl p-6">
        <p className="text-gray-600 leading-relaxed">
          {project.community_context}
        </p>
      </div>
    </section>
  );
}
