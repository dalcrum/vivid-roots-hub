import { createServerSupabase } from "@/lib/supabase-server";
import Link from "next/link";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-700" },
  in_review: {
    label: "Ready for Review",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  published: {
    label: "Published",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
};

export default async function UpdatesPage() {
  const supabase = await createServerSupabase();

  const { data: updates } = await supabase
    .from("project_updates")
    .select("*, projects(title, community)")
    .order("created_at", { ascending: false });

  const updateList = updates || [];

  const drafts = updateList.filter((u) => u.review_status === "draft");
  const inReview = updateList.filter((u) => u.review_status === "in_review");
  const published = updateList.filter((u) => u.review_status === "published");

  const renderUpdateItem = (update: (typeof updateList)[0]) => {
    const project = update.projects as {
      title: string;
      community: string;
    } | null;
    const config = statusConfig[update.review_status] || statusConfig.draft;

    return (
      <Link
        key={update.id}
        href={`/admin/updates/${update.id}`}
        className="block p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {project?.title || "Unknown Project"}
            </p>
            <p className="text-sm text-gray-500">
              📍 {project?.community || "—"} •{" "}
              {new Date(update.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {update.field_notes && (
              <p className="text-sm text-gray-400 truncate mt-1">
                {update.field_notes.slice(0, 100)}...
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
            <span className="text-gray-300">→</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Updates</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review field team submissions, polish with AI, and publish for donors.
        </p>
      </div>

      {/* Ready for Review */}
      {inReview.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 mb-6">
          <div className="p-5 border-b border-amber-100 bg-amber-50 rounded-t-xl">
            <h2 className="text-lg font-bold text-amber-800">
              👀 Ready for Review ({inReview.length})
            </h2>
            <p className="text-sm text-amber-600">
              AI-polished and waiting for your approval
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {inReview.map(renderUpdateItem)}
          </div>
        </div>
      )}

      {/* Drafts — need AI polish */}
      {drafts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              📝 Drafts ({drafts.length})
            </h2>
            <p className="text-sm text-gray-500">
              Raw submissions awaiting AI polish
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {drafts.map(renderUpdateItem)}
          </div>
        </div>
      )}

      {/* Published */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            ✅ Published ({published.length})
          </h2>
          <p className="text-sm text-gray-500">Live on the public site</p>
        </div>
        {published.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {published.map(renderUpdateItem)}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No published updates yet.
          </div>
        )}
      </div>
    </div>
  );
}
