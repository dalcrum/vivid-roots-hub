import { ProjectUpdate, UpdatePhoto } from "@/lib/types";

interface TimelineUpdate extends ProjectUpdate {
  photos: UpdatePhoto[];
}

export default function ProjectTimeline({
  updates,
}: {
  updates: TimelineUpdate[];
}) {
  if (updates.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-8 mt-10">
      <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">
        📅 Project Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-primary/30" />

        <div className="space-y-8">
          {updates.map((update, index) => (
            <div key={update.id} className="relative pl-12">
              {/* Dot on the line */}
              <div
                className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                  index === updates.length - 1
                    ? "bg-brand-primary"
                    : "bg-brand-primary/40"
                }`}
              />

              {/* Date badge */}
              <div className="mb-2">
                <span className="text-sm font-medium text-brand-primary-dark bg-brand-primary/10 px-3 py-1 rounded-full">
                  {new Date(update.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Content card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Polished narrative */}
                {update.ai_generated_narrative && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {update.ai_generated_narrative}
                  </div>
                )}

                {/* Fallback to field notes if no narrative */}
                {!update.ai_generated_narrative && update.field_notes && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {update.field_notes}
                  </div>
                )}

                {/* Personal story quote */}
                {update.personal_story_quote && (
                  <blockquote className="border-l-4 border-brand-primary/40 pl-4 my-4 italic text-gray-600">
                    &quot;{update.personal_story_quote}&quot;
                    {update.personal_story_name && (
                      <span className="block text-sm not-italic mt-1 text-brand-primary-dark font-medium">
                        — {update.personal_story_name}
                        {update.personal_story_age &&
                          `, age ${update.personal_story_age}`}
                      </span>
                    )}
                  </blockquote>
                )}

                {/* Photos */}
                {update.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {update.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={photo.photo_url}
                          alt={photo.caption || "Field photo"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
