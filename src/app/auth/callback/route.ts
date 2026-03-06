import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminSupabase } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );

  let authError = null;

  // Handle PKCE flow (code parameter)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
  }
  // Handle token hash flow (magic link with token_hash)
  else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "magiclink" | "email",
    });
    authError = error;
  }

  if (!authError && (code || token_hash)) {
    // Check if profile exists, create if not
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Use the service role client for profile operations.
      // The RLS INSERT policy only allows admins, but new users don't have
      // a profile yet. The admin client bypasses RLS so profiles can be created.
      const adminSupabase = createAdminSupabase();

      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!profile) {
        // Create profile for new user with their invited role
        const intendedRole = user.user_metadata?.intended_role || "field_team";
        const { error: insertError } = await adminSupabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            role: intendedRole,
            preferred_language: "en",
            last_login_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Failed to create profile:", user.id, insertError);
        }
      } else {
        // Update last login timestamp
        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to update last login:", user.id, updateError);
        }
      }
    }

    return NextResponse.redirect(`${origin}/admin`);
  }

  // Something went wrong, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
