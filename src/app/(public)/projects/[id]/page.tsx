import { createServerSupabase } from "@/lib/supabase-server";
import { Project, ProjectUpdate, UpdatePhoto } from "@/lib/types";
import ProjectHero from "@/components/ProjectHero";
import ImpactStats from "@/components/ImpactStats";
import AISummaryCard from "@/components/AISummaryCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import StorySection from "@/components/StorySection";
import PhotoGallery from "@/components/PhotoGallery";
import CommunityContext from "@/components/CommunityContext";
import FieldNotes from "@/components/FieldNotes";
import CallToAction from "@/components/CallToAction";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import Link from "next/link";
import { generateProgressSummary } from "@/lib/ai";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) {
    return (
      <>
        <PublicNav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Project not found
            </h1>
            <Link href="/impact" className="text-brand-primary hover:underline">
              Back to all projects
            </Link>
          </div>
        </div>
        <PublicFooter />
      </>
    );
  }

  // Fetch ALL published updates for this project
  const { data: updates } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", id)
    .eq("review_status", "published")
    .order("created_at", { ascending: true });

  const publishedUpdates = (updates as ProjectUpdate[]) || [];

  // Fetch photos for all published updates
  const updateIds = publishedUpdates.map((u) => u.id);
  let allPhotos: UpdatePhoto[] = [];
  if (updateIds.length > 0) {
    const { data: photoData } = await supabase
      .from("update_photos")
      .select("*")
      .in("update_id", updateIds);
    allPhotos = (photoData as UpdatePhoto[]) || [];
  }

  // Attach photos to their updates
  const updatesWithPhotos = publishedUpdates.map((u) => ({
    ...u,
    photos: allPhotos.filter((p) => p.update_id === u.id),
  }));

  // Determine which view to show
  const hasMultipleUpdates = publishedUpdates.length >= 2;
  const isCompleted = project.status === "completed";
  const hasImpactStory = !!project.impact_story;
  const showTimeline = hasMultipleUpdates || isCompleted;

  // Generate progress summary for active projects with multiple updates
  let progressSummary: string | null = null;
  if (hasMultipleUpdates && !isCompleted) {
    const narratives = publishedUpdates.map(
      (u) => u.ai_generated_narrative || u.field_notes || ""
    );
    try {
      progressSummary = await generateProgressSummary(
        project.title,
        project.community || "",
        project.type,
        narratives
      );
    } catch {
      // If AI fails, skip the summary
    }
  }

  // For single-update view (legacy/fallback)
  const latestUpdate =
    publishedUpdates.length > 0
      ? publishedUpdates[publishedUpdates.length - 1]
      : undefined;
  const latestPhotos = latestUpdate
    ? allPhotos.filter((p) => p.update_id === latestUpdate.id)
    : [];

  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-gray-50">
        <ProjectHero project={project} />
      <ImpactStats project={project} />

      {/* Completed project: Impact Story at top */}
      {isCompleted && hasImpactStory && (
        <AISummaryCard
          title="Impact Story"
          content={project.impact_story!}
          badge="Impact Story"
        />
      )}

      {/* Active project with multiple updates: Progress Summary */}
      {!isCompleted && progressSummary && (
        <AISummaryCard
          title="Progress Update"
          content={progressSummary}
          badge="AI Summary"
        />
      )}

      {/* Timeline view (multiple updates or completed) */}
      {showTimeline && <ProjectTimeline updates={updatesWithPhotos} />}

      {/* Single update fallback (1 or fewer published updates, not completed) */}
      {!showTimeline && latestUpdate && (
        <>
          <StorySection update={latestUpdate} />
          <PhotoGallery photos={latestPhotos} />
          {latestUpdate && <FieldNotes update={latestUpdate} />}
        </>
      )}

        <CommunityContext project={project} />
        <div className="mt-6" />
        <CallToAction />
      </main>
      <PublicFooter />
    </>
  );
}
