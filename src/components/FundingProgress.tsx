import { Project } from "@/lib/types";

export default function FundingProgress({ project }: { project: Project }) {
  const percentage = project.cost > 0 ? Math.round((project.funded / project.cost) * 100) : 0;
  const isFullyFunded = percentage >= 100;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${project.funded.toLocaleString()}
            </span>
            <span className="text-gray-500 ml-1">raised</span>
          </div>
          <span className={`text-lg font-bold ${isFullyFunded ? "text-brand-primary" : "text-amber-600"}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${isFullyFunded ? "bg-brand-primary" : "bg-amber-500"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-sm text-gray-400">
            Goal: ${project.cost.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}
