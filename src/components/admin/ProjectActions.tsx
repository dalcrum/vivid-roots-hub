"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveProjectAction, restoreProjectAction } from "@/app/(admin)/actions";

export function ArchiveButton({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    setLoading(true);
    const result = await archiveProjectAction(projectId);
    if (result.success) {
      router.refresh();
    }
    setLoading(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Archive &quot;{projectTitle.slice(0, 30)}...&quot;?</span>
        <button
          onClick={handleArchive}
          disabled={loading}
          className="text-xs text-white bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-400 hover:text-red-600 hover:underline"
    >
      Archive
    </button>
  );
}

export function RestoreButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    setLoading(true);
    const result = await restoreProjectAction(projectId);
    if (result.success) {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="text-xs text-[var(--brand-sky)] hover:underline font-medium disabled:opacity-50"
    >
      {loading ? "Restoring..." : "Restore"}
    </button>
  );
}
