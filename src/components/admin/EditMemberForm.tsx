"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Profile } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function EditMemberForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    role: profile.role,
    phone: profile.phone || "",
    preferred_language: profile.preferred_language,
    is_active: profile.is_active,
  });

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name || null,
        role: formData.role,
        phone: formData.phone || null,
        preferred_language: formData.preferred_language,
        is_active: formData.is_active,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated!" });
      router.refresh();
    }

    setSaving(false);
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSave}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Edit Team Member
        </h2>

        <div className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>

          {/* Full name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder="Enter full name"
              className={inputClass}
            />
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => update("role", e.target.value)}
              className={inputClass}
            >
              <option value="field_team">🌿 Field Team</option>
              <option value="editor">✏️ Editor</option>
              <option value="admin">👑 Admin</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Field Team: submit updates. Editor: review content. Admin: full access.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+502 1234 5678"
              className={inputClass}
            />
          </div>

          {/* Preferred language */}
          <div>
            <label className={labelClass}>Preferred Language</label>
            <select
              value={formData.preferred_language}
              onChange={(e) => update("preferred_language", e.target.value)}
              className={inputClass}
            >
              <option value="es">🇬🇹 Spanish</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Account Active</h3>
              <p className="text-sm text-gray-500">
                Inactive users cannot log in or submit updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("is_active", !formData.is_active)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.is_active ? "bg-emerald-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.is_active ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push("/admin/team")}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Back to Team
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

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
    </form>
  );
}
