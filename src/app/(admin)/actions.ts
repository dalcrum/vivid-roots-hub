"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { polishUpdate, generateImpactStory } from "@/lib/ai";

/**
 * Payload accepted by submitFieldUpdateAction.
 * When `isNewProject` is true, a new projects row is created from the
 * project-shaped fields. Otherwise `projectId` must reference an existing row.
 */
export interface SubmitFieldUpdateInput {
  // Project selector / new-project fields
  projectId: string;
  isNewProject: boolean;
  projectName: string;
  projectType: string;
  status: string;
  community: string;
  region: string;
  communityPopulation: string;
  communityDescription: string;
  hasSchool: boolean;
  schoolName: string;
  schoolSize: string;
  gradesServed: string;
  peopleServed: string;
  cost: string;

  // Update ("story") fields
  additionalNotes: string;
  hasPersonalStory: boolean;
  personalName: string;
  personalAge: string;
  personalBackground: string;
  personalQuote: string;
  brighterFuture: string;
}

export interface SubmitFieldUpdateResult {
  success: boolean;
  updateId?: string;
  projectId?: string;
  error?: string;
}

/**
 * Create a project_updates row (and a new projects row if needed) atomically.
 *
 * Uses the admin Supabase client to bypass RLS — the same pattern used by
 * /api/upload — so team members whose RLS policies don't allow direct inserts
 * can still submit field updates. Authentication is verified first via the
 * normal server client so this action is NOT a public write endpoint.
 *
 * Atomicity: if we create a new project and the subsequent update insert
 * fails, we delete the just-created project before returning. This prevents
 * the "orphan duplicate project" bug caused by retrying a failed submit.
 */
export async function submitFieldUpdateAction(
  input: SubmitFieldUpdateInput
): Promise<SubmitFieldUpdateResult> {
  // 1. Verify the caller is signed in. We use the user-scoped server client
  //    for this check — not the admin client — so we don't accidentally
  //    create a public write endpoint.
  const serverSupabase = await createServerSupabase();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // 2. Use admin client for the actual writes so RLS doesn't block team
  //    members who don't have direct INSERT permission on project_updates.
  let admin;
  try {
    admin = createAdminSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `Server config error: ${msg}` };
  }

  let projectId = input.projectId;
  let createdProjectId: string | null = null;

  // 3. Create the project first if this is a new one. Track the new id so
  //    we can roll it back if the update insert fails below.
  if (input.isNewProject) {
    const { data: newProject, error: projectError } = await admin
      .from("projects")
      .insert({
        title: input.projectName,
        type: input.projectType,
        status: input.status,
        community: input.community,
        region: input.region,
        community_population: parseInt(input.communityPopulation) || null,
        community_context: input.communityDescription || null,
        school_name: input.hasSchool ? input.schoolName || null : null,
        school_size: input.hasSchool
          ? parseInt(input.schoolSize) || null
          : null,
        grades_served: input.hasSchool ? input.gradesServed || null : null,
        people_served: parseInt(input.peopleServed) || 0,
        students_impacted: input.hasSchool
          ? parseInt(input.schoolSize) || 0
          : 0,
        cost: parseFloat(input.cost) || 0,
        funded: 0,
        started_at: new Date().toISOString().split("T")[0],
      })
      .select("id")
      .single();

    if (projectError || !newProject) {
      return {
        success: false,
        error:
          projectError?.message ||
          "Failed to create project (no row returned).",
      };
    }

    projectId = newProject.id;
    createdProjectId = newProject.id;
  }

  // 4. Create the project_updates row.
  const { data: updateRow, error: updateError } = await admin
    .from("project_updates")
    .insert({
      project_id: projectId,
      field_notes: input.additionalNotes || null,
      personal_story_name: input.hasPersonalStory ? input.personalName : null,
      personal_story_age: input.hasPersonalStory
        ? parseInt(input.personalAge) || null
        : null,
      personal_story_quote: input.hasPersonalStory
        ? input.personalQuote
        : null,
      personal_story: input.hasPersonalStory ? input.personalBackground : null,
      personal_story_after: input.brighterFuture || null,
      review_status: "draft",
    })
    .select("id")
    .single();

  if (updateError || !updateRow) {
    // Roll back the orphan project if we just created one.
    if (createdProjectId) {
      await admin.from("projects").delete().eq("id", createdProjectId);
    }
    return {
      success: false,
      error:
        updateError?.message ||
        "Failed to create update (no row returned).",
    };
  }

  return {
    success: true,
    updateId: updateRow.id,
    projectId,
  };
}

/**
 * Attach a photo to an existing update. Uses the admin client to bypass RLS
 * on update_photos, same rationale as submitFieldUpdateAction above.
 * The file itself must already be uploaded via /api/upload — this action
 * only writes the DB row.
 */
export async function attachUpdatePhotoAction(
  updateId: string,
  photoUrl: string,
  isHero: boolean
): Promise<{ success: boolean; error?: string }> {
  const serverSupabase = await createServerSupabase();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  let admin;
  try {
    admin = createAdminSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `Server config error: ${msg}` };
  }

  const { error } = await admin.from("update_photos").insert({
    update_id: updateId,
    photo_url: photoUrl,
    caption: null,
    is_hero: isHero,
  });

  return { success: !error, error: error?.message };
}

/**
 * AI-polish a raw field update and move it to "in_review"
 */
export async function polishUpdateAction(updateId: string) {
  const supabase = await createServerSupabase();

  // Fetch the update with its project
  const { data: update, error: fetchError } = await supabase
    .from("project_updates")
    .select("*, projects(*)")
    .eq("id", updateId)
    .single();

  if (fetchError || !update) {
    return { success: false, narrative: null, error: "Update not found" };
  }

  const project = update.projects as {
    title: string;
    community: string;
    region: string;
    type: string;
  };

  // Call Claude AI to polish
  const narrative = await polishUpdate({
    projectTitle: project.title,
    community: project.community || "",
    region: project.region || "",
    projectType: project.type,
    fieldNotes: update.field_notes,
    personalStoryName: update.personal_story_name,
    personalStoryAge: update.personal_story_age,
    personalStoryQuote: update.personal_story_quote,
    personalStory: update.personal_story,
    personalStoryAfter: update.personal_story_after,
  });

  if (!narrative) {
    return { success: false, narrative: null, error: "AI generation failed" };
  }

  // Save polished narrative and move to "in_review"
  const { error: updateError } = await supabase
    .from("project_updates")
    .update({
      ai_generated_narrative: narrative,
      review_status: "in_review",
    })
    .eq("id", updateId);

  if (updateError) {
    return { success: false, narrative: null, error: updateError.message };
  }

  return { success: true, narrative };
}

/**
 * Publish an update (optionally with edited narrative)
 */
export async function publishUpdateAction(
  updateId: string,
  editedNarrative?: string
) {
  const supabase = await createServerSupabase();

  const updateData: { review_status: string; ai_generated_narrative?: string } =
    { review_status: "published" };

  if (editedNarrative) {
    updateData.ai_generated_narrative = editedNarrative;
  }

  const { error } = await supabase
    .from("project_updates")
    .update(updateData)
    .eq("id", updateId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Set hero image on project if it doesn't have one
  const { data: update } = await supabase
    .from("project_updates")
    .select("project_id")
    .eq("id", updateId)
    .single();

  if (update) {
    const { data: photos } = await supabase
      .from("update_photos")
      .select("photo_url")
      .eq("update_id", updateId)
      .eq("is_hero", true)
      .limit(1);

    if (photos && photos.length > 0) {
      const { data: project } = await supabase
        .from("projects")
        .select("hero_image_url")
        .eq("id", update.project_id)
        .single();

      if (project && !project.hero_image_url) {
        await supabase
          .from("projects")
          .update({ hero_image_url: photos[0].photo_url })
          .eq("id", update.project_id);
      }
    }
  }

  return { success: true };
}

/**
 * Send an update back to draft (reject)
 */
export async function rejectUpdateAction(updateId: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("project_updates")
    .update({ review_status: "draft" })
    .eq("id", updateId);

  return { success: !error, error: error?.message };
}

/**
 * Update a project's status
 */
export async function updateProjectStatusAction(
  projectId: string,
  newStatus: string,
  completedAt?: string
) {
  const supabase = await createServerSupabase();

  const updateData: { status: string; completed_at?: string } = {
    status: newStatus,
  };

  if (newStatus === "completed") {
    updateData.completed_at =
      completedAt || new Date().toISOString().split("T")[0];
  }

  // Clear completed_at if moving back from completed
  if (newStatus !== "completed") {
    updateData.completed_at = undefined as unknown as string;
  }

  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}

/**
 * Update project metadata
 */
export async function updateProjectMetadataAction(
  projectId: string,
  data: {
    title?: string;
    community?: string | null;
    region?: string | null;
    people_served?: number;
    community_population?: number | null;
    community_context?: string | null;
    school_name?: string | null;
    school_size?: number | null;
    grades_served?: string | null;
    cost?: number;
    funded?: number;
  }
) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("projects")
    .update(data)
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}

/**
 * Generate an impact story for a completed project
 */
export async function generateImpactStoryAction(projectId: string) {
  const supabase = await createServerSupabase();

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    return { success: false, story: null, error: "Project not found" };
  }

  // Fetch all published updates
  const { data: updates } = await supabase
    .from("project_updates")
    .select("ai_generated_narrative, field_notes")
    .eq("project_id", projectId)
    .eq("review_status", "published")
    .order("created_at", { ascending: true });

  const narratives = (updates || []).map(
    (u) => u.ai_generated_narrative || u.field_notes || ""
  );

  if (narratives.length === 0) {
    return {
      success: false,
      story: null,
      error: "No published updates to generate from",
    };
  }

  const story = await generateImpactStory(
    project.title,
    project.community || "",
    project.region || "",
    project.type,
    project.people_served,
    project.community_context,
    narratives
  );

  if (!story) {
    return { success: false, story: null, error: "AI generation failed" };
  }

  // Save to project
  const { error } = await supabase
    .from("projects")
    .update({ impact_story: story })
    .eq("id", projectId);

  return { success: !error, story, error: error?.message };
}

/**
 * Save an edited impact story
 */
export async function saveImpactStoryAction(
  projectId: string,
  story: string
) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("projects")
    .update({ impact_story: story })
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}

/**
 * Archive a project (soft delete)
 */
export async function archiveProjectAction(projectId: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("projects")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}

/**
 * Restore an archived project
 */
export async function restoreProjectAction(projectId: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("projects")
    .update({ archived_at: null })
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}

/**
 * Update a project's hero image URL
 */
export async function updateProjectHeroAction(
  projectId: string,
  heroImageUrl: string
) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("projects")
    .update({ hero_image_url: heroImageUrl })
    .eq("id", projectId);

  return { success: !error, error: error?.message };
}
