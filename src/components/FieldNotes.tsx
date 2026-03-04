import { ProjectUpdate } from "@/lib/types";

export default function FieldNotes({ update }: { update: ProjectUpdate }) {
  if (!update.field_notes && !update.field_notes_en) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
        Notes from the Ground
      </h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        {update.field_notes && (
          <p className="text-amber-900 leading-relaxed italic mb-4">
            &ldquo;{update.field_notes}&rdquo;
          </p>
        )}
        {update.field_notes_en && (
          <p className="text-amber-700 leading-relaxed text-sm mb-4">
            &ldquo;{update.field_notes_en}&rdquo;
          </p>
        )}
        <p className="text-amber-600 text-sm font-medium">
          — Vivid Roots Field Team, Guatemala
        </p>
      </div>
    </section>
  );
}
