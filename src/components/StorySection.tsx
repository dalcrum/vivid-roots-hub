import { ProjectUpdate } from "@/lib/types";

export default function StorySection({ update }: { update: ProjectUpdate }) {
  return (
    <section className="max-w-5xl mx-auto px-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">The Story</h2>

      {/* Personal quote callout */}
      {update.personal_story_quote && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-6 mb-8">
          <p className="text-emerald-900 text-lg italic mb-1">
            &ldquo;{update.personal_story_quote}&rdquo;
          </p>
          {update.personal_story_quote_en && (
            <p className="text-emerald-700 text-sm italic mb-3">
              &ldquo;{update.personal_story_quote_en}&rdquo;
            </p>
          )}
          <p className="text-emerald-600 text-sm font-medium">
            — {update.personal_story_name}
            {update.personal_story_age ? `, age ${update.personal_story_age}` : ""}
          </p>
        </div>
      )}

      {/* Main story */}
      {update.personal_story && (
        <div className="prose prose-gray max-w-none mb-8">
          {update.personal_story.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Impact / progress update */}
      {update.personal_story_after && (
        <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-xl p-6 border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {update.review_status === "published" ? "Impact Update" : "Progress Update"}
          </h3>
          {update.personal_story_after.split("\n").map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
