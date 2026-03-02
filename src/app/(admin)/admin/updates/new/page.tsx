import { createServerSupabase } from "@/lib/supabase-server";
import { Project } from "@/lib/types";
import FieldInputForm from "@/components/admin/FieldInputForm";
import type { Language } from "@/lib/translations";

export default async function NewUpdatePage() {
  const supabase = await createServerSupabase();

  // Fetch existing projects for the dropdown
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("title", { ascending: true });

  // Get user's preferred language
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userLang: Language = "en";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_language")
      .eq("id", user.id)
      .single();
    userLang = (profile?.preferred_language as Language) || "en";
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {userLang === "es" ? (
            <>
              Enviar Actualizacion de Campo
              <span className="block text-sm font-normal text-gray-400 mt-1">
                Submit Field Update
              </span>
            </>
          ) : (
            "Submit Field Update"
          )}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {userLang === "es"
            ? "Comparte lo que esta pasando en Guatemala."
            : "Share what's happening on the ground in Guatemala."}
        </p>
      </div>
      <FieldInputForm projects={(projects as Project[]) || []} lang={userLang} />
    </div>
  );
}
