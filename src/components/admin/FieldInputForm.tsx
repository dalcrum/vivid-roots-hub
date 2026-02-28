"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Project } from "@/lib/types";
import StepIndicator from "./StepIndicator";
import { useRouter } from "next/navigation";

interface FormData {
  // Step 1
  projectId: string;
  isNewProject: boolean;
  projectName: string;
  projectType: string;
  status: string;
  community: string;
  region: string;
  peopleServed: string;
  studentsImpacted: string;
  cost: string;
  // Step 2
  challenge: string;
  solution: string;
  brighterFuture: string;
  hasPersonalStory: boolean;
  personalName: string;
  personalAge: string;
  personalBackground: string;
  personalQuote: string;
  // Step 3
  additionalNotes: string;
}

const initialFormData: FormData = {
  projectId: "",
  isNewProject: true,
  projectName: "",
  projectType: "Clean Water",
  status: "in_progress",
  community: "",
  region: "",
  peopleServed: "",
  studentsImpacted: "",
  cost: "",
  challenge: "",
  solution: "",
  brighterFuture: "",
  hasPersonalStory: false,
  personalName: "",
  personalAge: "",
  personalBackground: "",
  personalQuote: "",
  additionalNotes: "",
};

export default function FieldInputForm({
  projects,
}: {
  projects: Project[];
}) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const update = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const supabase = createClient();

    try {
      let projectId = formData.projectId;

      // If new project, create it first
      if (formData.isNewProject) {
        const { data: newProject, error: projectError } = await supabase
          .from("projects")
          .insert({
            title: formData.projectName,
            type: formData.projectType,
            status: formData.status,
            community: formData.community,
            region: formData.region,
            people_served: parseInt(formData.peopleServed) || 0,
            students_impacted: parseInt(formData.studentsImpacted) || 0,
            cost: parseFloat(formData.cost) || 0,
            funded: 0,
            started_at: new Date().toISOString().split("T")[0],
          })
          .select()
          .single();

        if (projectError) throw projectError;
        projectId = newProject.id;
      }

      // Create the project update
      const { data: updateData, error: updateError } = await supabase
        .from("project_updates")
        .insert({
          project_id: projectId,
          field_notes: formData.additionalNotes || null,
          personal_story_name: formData.hasPersonalStory
            ? formData.personalName
            : null,
          personal_story_age: formData.hasPersonalStory
            ? parseInt(formData.personalAge) || null
            : null,
          personal_story_quote: formData.hasPersonalStory
            ? formData.personalQuote
            : null,
          personal_story: formData.hasPersonalStory
            ? formData.personalBackground
            : null,
          personal_story_after: formData.brighterFuture || null,
          review_status: "draft",
        })
        .select()
        .single();

      if (updateError) throw updateError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileName = `${updateData.id}/${Date.now()}-${i}.${file.name.split(".").pop()}`;

        const { error: uploadError } = await supabase.storage
          .from("project-photos")
          .upload(fileName, file);

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("project-photos").getPublicUrl(fileName);

          await supabase.from("update_photos").insert({
            update_id: updateData.id,
            photo_url: publicUrl,
            caption: null,
            is_hero: i === 0,
          });
        }
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Update Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Your field update has been saved as a draft. An editor will review it
          soon.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setFormData(initialFormData);
              setPhotos([]);
              setStep(0);
              setSubmitted(false);
            }}
            className="bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-700"
          >
            Submit Another
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={step} />

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            📋 Basic Information
          </h2>

          {/* New vs existing project toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => update("isNewProject", true)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                formData.isNewProject
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🆕 New Project
            </button>
            <button
              onClick={() => update("isNewProject", false)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                !formData.isNewProject
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🔄 Existing Project
            </button>
          </div>

          {formData.isNewProject ? (
            <>
              <div className="mb-4">
                <label className={labelClass}>Project Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                  placeholder="e.g. Escuela El Mirador - Clean Water"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Clean Water">💧 Clean Water</option>
                    <option value="Education">📚 Education</option>
                    <option value="Health">🏥 Health</option>
                    <option value="Infrastructure">🏗️ Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => update("status", e.target.value)}
                    className={inputClass}
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Community</label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => update("community", e.target.value)}
                    placeholder="e.g. El Mirador, Solola"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => update("region", e.target.value)}
                    placeholder="e.g. Solola, Guatemala"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>People Served</label>
                  <input
                    type="number"
                    value={formData.peopleServed}
                    onChange={(e) => update("peopleServed", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Students</label>
                  <input
                    type="number"
                    value={formData.studentsImpacted}
                    onChange={(e) => update("studentsImpacted", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Cost (USD)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => update("cost", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className={labelClass}>Select Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => update("projectId", e.target.value)}
                className={inputClass}
              >
                <option value="">Choose a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.community}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Step 2: The Story */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            📖 The Story
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Tell us what&apos;s happening on the ground. Write in whatever language
            feels natural.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>Tip:</strong> Don&apos;t worry about writing perfectly.
              Just share what you see, hear, and feel. AI will help polish it
              later.
            </p>
          </div>

          <div className="mb-4">
            <label className={labelClass}>
              What challenge does the community face?
            </label>
            <textarea
              value={formData.challenge}
              onChange={(e) => update("challenge", e.target.value)}
              placeholder="Describe the problem or need..."
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>
              What is being done to solve it?
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => update("solution", e.target.value)}
              placeholder="Describe the project's approach..."
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>
              What will be different now?
            </label>
            <textarea
              value={formData.brighterFuture}
              onChange={(e) => update("brighterFuture", e.target.value)}
              placeholder="Describe the impact or expected outcome..."
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Personal story toggle */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">
                  Add a Personal Story
                </h3>
                <p className="text-sm text-gray-500">
                  A personal story makes the biggest impact on donors.
                </p>
              </div>
              <button
                onClick={() =>
                  update("hasPersonalStory", !formData.hasPersonalStory)
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.hasPersonalStory ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.hasPersonalStory ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {formData.hasPersonalStory && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={formData.personalName}
                      onChange={(e) => update("personalName", e.target.value)}
                      placeholder="e.g. Maria Elena"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      value={formData.personalAge}
                      onChange={(e) => update("personalAge", e.target.value)}
                      placeholder="e.g. 8"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Their story</label>
                  <textarea
                    value={formData.personalBackground}
                    onChange={(e) =>
                      update("personalBackground", e.target.value)
                    }
                    placeholder="Who are they? How does this project affect their life?"
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    A quote from them (in their words)
                  </label>
                  <input
                    type="text"
                    value={formData.personalQuote}
                    onChange={(e) => update("personalQuote", e.target.value)}
                    placeholder='e.g. "Now I can drink water at school..."'
                    className={`${inputClass} italic`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            📸 Photos & Details
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload photos from the field. The first photo will be the main
            image.
          </p>

          {/* Photo grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                    Main
                  </span>
                )}
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}

            {/* Add photo button */}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
              <span className="text-3xl text-gray-400 mb-1">+</span>
              <span className="text-xs text-gray-400">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className={labelClass}>Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => update("additionalNotes", e.target.value)}
              placeholder="Any additional details you want to share..."
              rows={4}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ✅ Review & Submit
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Project
              </h3>
              <p className="font-medium text-gray-900">
                {formData.isNewProject
                  ? `🆕 ${formData.projectName || "Unnamed"}`
                  : `🔄 ${projects.find((p) => p.id === formData.projectId)?.title || "Not selected"}`}
              </p>
              {formData.isNewProject && (
                <p className="text-sm text-gray-500 mt-1">
                  {formData.projectType} - {formData.community} -{" "}
                  {formData.status}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Story</h3>
              <div className="space-y-1 text-sm">
                <p>
                  {formData.challenge ? "✅" : "⬜"} Challenge described
                </p>
                <p>
                  {formData.solution ? "✅" : "⬜"} Solution described
                </p>
                <p>
                  {formData.brighterFuture ? "✅" : "⬜"} Impact described
                </p>
              </div>
            </div>

            {formData.hasPersonalStory && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-emerald-700 mb-1">
                  Personal Story
                </h3>
                <p className="font-medium text-gray-900">
                  {formData.personalName}, age {formData.personalAge}
                </p>
                {formData.personalQuote && (
                  <p className="text-sm italic text-gray-600 mt-1">
                    &quot;{formData.personalQuote}&quot;
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Photos
              </h3>
              <p className="text-sm text-gray-900">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} attached
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : router.push("/admin"))}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Update"}
          </button>
        )}
      </div>
    </div>
  );
}
