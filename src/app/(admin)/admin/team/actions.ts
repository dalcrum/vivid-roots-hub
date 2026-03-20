"use server";

import { createAdminSupabase } from "@/lib/supabase-admin";

export async function inviteTeamMember(email: string, role: string) {
  const adminSupabase = createAdminSupabase();

  // Check if a profile already exists for this email
  const { data: existing } = await adminSupabase
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) {
    return { error: "A team member with this email already exists." };
  }

  // Create the auth user and send them a magic link invite
  const { data: authData, error: authError } =
    await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: { intended_role: role },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivid-roots-hub.vercel.app"}/auth/callback`,
    });

  if (authError) {
    // If user already exists in auth but has no profile, get their ID
    if (authError.message?.includes("already been registered")) {
      const { data: users } = await adminSupabase.auth.admin.listUsers();
      const existingUser = users?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        // Create the missing profile
        const { error: insertError } = await adminSupabase
          .from("profiles")
          .insert({
            id: existingUser.id,
            email: email.toLowerCase(),
            role,
            preferred_language: "en",
            is_active: true,
          });

        if (insertError) {
          return { error: `Failed to create profile: ${insertError.message}` };
        }

        // Re-send them an invite email
        await adminSupabase.auth.admin.inviteUserByEmail(email, {
          data: { intended_role: role },
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivid-roots-hub.vercel.app"}/auth/callback`,
        });

        return { success: true };
      }
    }

    return { error: authError.message };
  }

  // Create profile immediately so they appear on the Team page
  if (authData.user) {
    const { error: insertError } = await adminSupabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        role,
        preferred_language: "en",
        is_active: true,
      });

    if (insertError) {
      console.error("Failed to create profile during invite:", insertError);
      return { error: `Invite sent but profile creation failed: ${insertError.message}` };
    }
  }

  return { success: true };
}
