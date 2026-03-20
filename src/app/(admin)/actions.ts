"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import { polishUpdate, generateImpactStory } from "@/lib/ai";

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
