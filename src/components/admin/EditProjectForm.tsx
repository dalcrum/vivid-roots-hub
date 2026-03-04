"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import {
  updateProjectStatusAction,
  updateProjectMetadataAction,
  generateImpactStoryAction,
  saveImpactStoryAction,
} from "@/app/(admin)/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProjectForm({
  project,
  publishedUpdateCount,
}: {
  project: Project;
  publishedUpdateCount: number;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: project.title,
    status: project.status,
    community: project.community || "",
    region: project.region || "",
    people_served: project.people_served,
    community_population: project.community_population || "",
    community_context: project.community_context || "",
    school_name: project.school_name || "",
    school_size: project.school_size || "",
    grades_served: project.grades_served || "",
    cost: project.cost,
    funded: project.funded,
  });

  const [impactStory, setImpactStory] = useState(
    project.impact_story || ""
  );

  const update = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Save metadata
    const metaResult = await updateProjectMetadataAction(project.id, {
      title: formData.title,
      community: formData.community || null,
      region: formData.region || null,
      people_served: Number(formData.people_served) || 0,
      community_population: Number(formData.community_population) || null,
      community_context: formData.community_context || null,
      school_name: formData.school_name || null,
      school_size: Number(formData.school_size) || null,
      grades_served: formData.grades_served || null,
      cost: Number(formData.cost) || 0,
      funded: Number(formData.funded) || 0,
    });

    // Save status if changed
    if (formData.status !== project.status) {
      await updateProjectStatusAction(project.id, formData.status);
    }

    if (metaResult.success) {
      setMessage({ type: "success", text: "Project updated!" });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: metaResult.error || "Failed to save",
      });
    }

    setSaving(false);
  };

  const handleGenerateImpactStory = async () => {
    setLoading("impact");
    setMessage(null);
    const result = await generateImpactStoryAction(project.id);
    if (result.success && result.story) {
      setImpactStory(result.story);
      setMessage({ type: "success", text: "Impact story generated!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to generate",
      });
    }
    setLoading(null);
  };

  const handleSaveImpactStory = async () => {
    setLoading("saveStory");
    const result = await saveImpactStoryAction(project.id, impactStory);
    if (result.success) {
      setMessage({ type: "success", text: "Impact story saved!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to save",
      });
    }
    setLoading(null);
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      {/* Project Metadata */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          📋 Project Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => update("status", e.target.value)}
                className={inputClass}
              >
                <option value="planning">📋 Planning</option>
                <option value="in_progress">🚀 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
              {formData.status === "completed" &&
                project.status !== "completed" && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Marking as completed will set today as the completion
                    date.
                  </p>
                )}
            </div>
            <div>
              <label className={labelClass}>People Impacted</label>
              <input
                type="number"
                value={formData.people_served}
                onChange={(e) =>
                  update("people_served", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Community</label>
              <input
                type="text"
                value={formData.community}
                onChange={(e) => update("community", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => update("region", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Community Population</label>
              <input
                type="number"
                value={formData.community_population}
                onChange={(e) =>
                  update("community_population", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>School Name</label>
              <input
                type="text"
                value={formData.school_name}
                onChange={(e) => update("school_name", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>About this Community</label>
            <textarea
              value={formData.community_context}
              onChange={(e) => update("community_context", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* Internal tracking */}
        <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
          <h3 className="text-sm font-bold text-gray-500 mb-3">
            🔒 Internal Only
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cost (USD)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => update("cost", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Funded (USD)</label>
              <input
                type="number"
                value={formData.funded}
                onChange={(e) => update("funded", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/projects/${project.id}`}
            target="_blank"
            className="text-sm text-emerald-600 hover:underline"
          >
            View public page →
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Impact Story — only show for completed or about-to-be-completed projects */}
      {(formData.status === "completed" || project.impact_story) && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                📖 Impact Story
              </h2>
              <p className="text-sm text-gray-500">
                AI-generated narrative for the completed project page
              </p>
            </div>
            <button
              onClick={handleGenerateImpactStory}
              disabled={!!loading || publishedUpdateCount === 0}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              {loading === "impact" ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Generating...
                </span>
              ) : (
                "🤖 Generate from Updates"
              )}
            </button>
          </div>

          {publishedUpdateCount === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-700">
                ⚠️ You need at least one published update to generate an impact
                story. Go to{" "}
                <Link
                  href="/admin/updates"
                  className="underline font-medium"
                >
                  Review Updates
                </Link>{" "}
                to publish some first.
              </p>
            </div>
          )}

          <textarea
            value={impactStory}
            onChange={(e) => setImpactStory(e.target.value)}
            rows={12}
            className={`${inputClass} text-sm leading-relaxed`}
            placeholder="The impact story will appear here after generation..."
          />

          {impactStory && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveImpactStory}
                disabled={!!loading}
                className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading === "saveStory" ? "Saving..." : "Save Impact Story"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
