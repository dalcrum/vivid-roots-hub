"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteTeamMember } from "@/app/(admin)/admin/team/actions";

export default function InviteUserForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("field_team");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setMessage(null);

    try {
      const result = await inviteTeamMember(email, role);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: `Invitation sent to ${email}! They will appear below and receive a magic link to sign in.`,
        });
        setEmail("");
        setRole("field_team");
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
      >
        + Invite Team Member
      </button>
    );
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Invite Team Member
        </h2>
        <button
          onClick={() => {
            setIsOpen(false);
            setMessage(null);
          }}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleInvite}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@email.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            >
              <option value="field_team">🌿 Field Team</option>
              <option value="editor">✏️ Editor</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-emerald-600 text-white font-medium px-5 py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm ${
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
