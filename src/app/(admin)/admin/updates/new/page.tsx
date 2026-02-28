import { createServerSupabase } from "@/lib/supabase-server";
import { Project } from "@/lib/types";
import FieldInputForm from "@/components/admin/FieldInputForm";

export default async function NewUpdatePage() {
  const supabase = await createServerSupabase();

  // Fetch existing projects for the dropdown
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("title", { ascending: true });

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Submit Field Update
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Share what&apos;s happening on the ground in Guatemala.
        </p>
      </div>
      <FieldInputForm projects={(projects as Project[]) || []} />
    </div>
  );
}
