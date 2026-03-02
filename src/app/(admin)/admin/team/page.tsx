import { createServerSupabase } from "@/lib/supabase-server";
import { Profile } from "@/lib/types";
import Link from "next/link";
import InviteUserForm from "@/components/admin/InviteUserForm";

const roleConfig: Record<string, { label: string; bg: string; text: string }> = {
  admin: { label: "Admin", bg: "bg-purple-100", text: "text-purple-700" },
  editor: { label: "Editor", bg: "bg-blue-100", text: "text-blue-700" },
  field_team: { label: "Field Team", bg: "bg-emerald-100", text: "text-emerald-700" },
};

export default async function TeamPage() {
  const supabase = await createServerSupabase();

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const memberList = (members as Profile[]) || [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your team members and their roles.
          </p>
        </div>
      </div>

      {/* Invite form */}
      <InviteUserForm />

      {/* Team list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Team Members ({memberList.length})
          </h2>
        </div>
        {memberList.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {memberList.map((member) => {
              const role = roleConfig[member.role] || roleConfig.field_team;
              const initial = (
                member.full_name?.[0] ||
                member.email?.[0] ||
                "?"
              ).toUpperCase();

              return (
                <li key={member.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                        {initial}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">
                            {member.full_name || "No name set"}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${role.bg} ${role.text}`}
                          >
                            {role.label}
                          </span>
                          {!member.is_active && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          {member.phone && <span>📱 {member.phone}</span>}
                          <span>🌐 {member.preferred_language === "es" ? "Spanish" : "English"}</span>
                          {member.last_login_at && (
                            <span>
                              Last login:{" "}
                              {new Date(member.last_login_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit link */}
                    <Link
                      href={`/admin/team/${member.id}`}
                      className="text-sm text-emerald-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No team members yet. Invite someone above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
