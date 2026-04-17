"use client";

import { useState } from "react";
import { ProjectUpdate, UpdatePhoto } from "@/lib/types";
import {
  polishUpdateAction,
  publishUpdateAction,
  rejectUpdateAction,
} from "@/app/(admin)/actions";
import { useRouter } from "next/navigation";

export default function ReviewUpdatePanel({
  update,
  photos,
}: {
  update: ProjectUpdate;
  photos: UpdatePhoto[];
}) {
  const router = useRouter();
  const [narrative, setNarrative] = useState(
    update.ai_generated_narrative || ""
  );
  const [status, setStatus] = useState(update.review_status);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePolish = async () => {
    setLoading("polish");
    setMessage(null);
    const result = await polishUpdateAction(update.id);
    if (result.success && result.narrative) {
      setNarrative(result.narrative);
      setStatus("in_review");
      setMessage({ type: "success", text: "AI polish generated!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to generate polish",
      });
    }
    setLoading(null);
  };

  const handlePublish = async () => {
    setLoading("publish");
    setMessage(null);
    const result = await publishUpdateAction(update.id, narrative);
    if (result.success) {
      setStatus("published");
      setMessage({ type: "success", text: "Update published!" });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to publish",
      });
    }
    setLoading(null);
  };

  const handleReject = async () => {
    setLoading("reject");
    setMessage(null);
    const result = await rejectUpdateAction(update.id);
    if (result.success) {
      setStatus("draft");
      setNarrative("");
      setMessage({ type: "success", text: "Sent back to draft" });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to reject",
      });
    }
    setLoading(null);
  };

  const statusBadge = {
    draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-700" },
    in_review: {
      label: "In Review",
      bg: "bg-amber-100",
      text: "text-amber-700",
    },
    published: {
      label: "Published",
      bg: "bg-[var(--brand-sky-light)]/20",
      text: "text-[var(--brand-sky)]",
    },
  }[status] || { label: "Draft", bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <div>
      {/* Status badge */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw field notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[var(--brand-navy)] mb-4">
            📝 Raw Field Notes
          </h2>

          {update.field_notes && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Field Notes
              </h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {update.field_notes}
              </p>
            </div>
          )}

          {update.personal_story_name && (
            <div className="mb-4 bg-[var(--brand-cream-warm)] rounded-xl p-4">
              <h3 className="text-sm font-medium text-[var(--brand-sky)] mb-2">
                Personal Story
              </h3>
              <p className="font-medium text-[var(--brand-navy)]">
                {update.personal_story_name}
                {update.personal_story_age &&
                  `, age ${update.personal_story_age}`}
              </p>
              {update.personal_story && (
                <p className="text-sm text-gray-600 mt-1">
                  {update.personal_story}
                </p>
              )}
              {update.personal_story_quote && (
                <p className="text-sm italic text-gray-600 mt-2">
                  &quot;{update.personal_story_quote}&quot;
                </p>
              )}
              {update.personal_story_after && (
                <div className="mt-2">
                  <span className="text-xs text-[var(--brand-sky)] font-medium">
                    Impact:
                  </span>
                  <p className="text-sm text-gray-600">
                    {update.personal_story_after}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {photos.map((photo) => (
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
            </div>
          )}
        </div>

        {/* Right: AI-polished version */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[var(--brand-navy)] mb-4">
            ✨ AI-Polished Version
          </h2>

          {!narrative && status === "draft" ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                No AI-polished version yet. Click below to generate one.
              </p>
              <button
                onClick={handlePolish}
                disabled={loading === "polish"}
                className="bg-[var(--brand-sky)] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#2599B3] transition-colors disabled:opacity-50"
              >
                {loading === "polish" ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Generating...
                  </span>
                ) : (
                  "🤖 Generate AI Polish"
                )}
              </button>
            </div>
          ) : (
            <>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-[var(--brand-navy)] focus:ring-2 focus:ring-[var(--brand-sky)] focus:border-transparent outline-none text-sm leading-relaxed"
                placeholder="AI-polished narrative will appear here..."
              />
              <p className="text-xs text-gray-400 mt-1">
                You can edit this before publishing. This is what donors will
                see.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status !== "published" && narrative && (
            <button
              onClick={handlePolish}
              disabled={!!loading}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading === "polish" ? "Regenerating..." : "🔄 Regenerate"}
            </button>
          )}
          {status !== "draft" && status !== "published" && (
            <button
              onClick={handleReject}
              disabled={!!loading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {loading === "reject" ? "Sending back..." : "↩️ Send Back"}
            </button>
          )}
        </div>

        <div>
          {status !== "published" && narrative && (
            <button
              onClick={handlePublish}
              disabled={!!loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[var(--brand-sky)] rounded-xl hover:bg-[#2599B3] transition-colors disabled:opacity-50"
            >
              {loading === "publish"
                ? "Publishing..."
                : "✅ Publish for Donors"}
            </button>
          )}
          {status === "published" && (
            <span className="text-sm text-[var(--brand-sky)] font-medium">
              ✅ Live on the public site
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-[var(--brand-cream-warm)] text-[var(--brand-sky)] border border-[var(--brand-sky)]/30"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
