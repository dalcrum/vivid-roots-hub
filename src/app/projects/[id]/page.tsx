import { supabase } from "@/lib/supabase";
import { Project, ProjectUpdate, UpdatePhoto } from "@/lib/types";
import ProjectHero from "@/components/ProjectHero";
import ImpactStats from "@/components/ImpactStats";
import FundingProgress from "@/components/FundingProgress";
import StorySection from "@/components/StorySection";
import PhotoGallery from "@/components/PhotoGallery";
import CommunityContext from "@/components/CommunityContext";
import FieldNotes from "@/components/FieldNotes";
import CallToAction from "@/components/CallToAction";
import Link from "next/link";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
          <Link href="/" className="text-emerald-600 hover:underline">
            Back to all projects
          </Link>
        </div>
      </div>
    );
  }

  // Fetch the latest published update for this project
  const { data: updates } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", id)
    .eq("review_status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

  const update = updates?.[0] as ProjectUpdate | undefined;

  // Fetch photos
  let photos: UpdatePhoto[] = [];
  if (update) {
    const { data: photoData } = await supabase
      .from("update_photos")
      .select("*")
      .eq("update_id", update.id);
    photos = (photoData as UpdatePhoto[]) || [];
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ProjectHero project={project} />
      <ImpactStats project={project} />
      <FundingProgress project={project} />
      {update && <StorySection update={update} />}
      <PhotoGallery photos={photos} />
      <CommunityContext project={project} />
      {update && <FieldNotes update={update} />}
      <div className="mt-6" />
      <CallToAction />
    </main>
  );
}
