"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Project } from "@/lib/types";
import StepIndicator from "./StepIndicator";
import { useRouter } from "next/navigation";
import type { Language } from "@/lib/translations";

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

// Bilingual label helper
function BLabel({ en, es, lang }: { en: string; es: string; lang: Language }) {
  if (lang === "es") {
    return (
      <span>
        {es}
        <span className="block text-[0.75em] text-gray-400 font-normal leading-tight">
          {en}
        </span>
      </span>
    );
  }
  return <>{en}</>;
}

// Bilingual placeholder helper
function ph(en: string, es: string, lang: Language): string {
  return lang === "es" ? es : en;
}

export default function FieldInputForm({
  projects,
  lang = "en",
}: {
  projects: Project[];
  lang?: Language;
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
      alert(lang === "es" ? "Algo salio mal. Intenta de nuevo." : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <BLabel en="Update Submitted!" es="Actualizacion Enviada!" lang={lang} />
        </h2>
        <p className="text-gray-600 mb-6">
          <BLabel
            en="Your field update has been saved as a draft. An editor will review it soon."
            es="Tu actualizacion se ha guardado como borrador. Un editor la revisara pronto."
            lang={lang}
          />
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
            <BLabel en="Submit Another" es="Enviar Otra" lang={lang} />
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-300"
          >
            <BLabel en="Back to Dashboard" es="Volver al Panel" lang={lang} />
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
            📋 <BLabel en="Basic Information" es="Informacion Basica" lang={lang} />
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
              🆕 <BLabel en="New Project" es="Nuevo Proyecto" lang={lang} />
            </button>
            <button
              onClick={() => update("isNewProject", false)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                !formData.isNewProject
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🔄 <BLabel en="Existing Project" es="Proyecto Existente" lang={lang} />
            </button>
          </div>

          {formData.isNewProject ? (
            <>
              <div className="mb-4">
                <label className={labelClass}>
                  <BLabel en="Project Name" es="Nombre del Proyecto" lang={lang} />
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                  placeholder={ph("e.g. Escuela El Mirador - Clean Water", "ej. Escuela El Mirador - Agua Limpia", lang)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>
                    <BLabel en="Project Type" es="Tipo de Proyecto" lang={lang} />
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Clean Water">💧 {lang === "es" ? "Agua Limpia" : "Clean Water"}</option>
                    <option value="Education">📚 {lang === "es" ? "Educacion" : "Education"}</option>
                    <option value="Health">🏥 {lang === "es" ? "Salud" : "Health"}</option>
                    <option value="Infrastructure">🏗️ {lang === "es" ? "Infraestructura" : "Infrastructure"}</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="Status" es="Estado" lang={lang} />
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => update("status", e.target.value)}
                    className={inputClass}
                  >
                    <option value="planning">{lang === "es" ? "Planificando" : "Planning"}</option>
                    <option value="in_progress">{lang === "es" ? "En Progreso" : "In Progress"}</option>
                    <option value="completed">{lang === "es" ? "Completado" : "Completed"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>
                    <BLabel en="Community" es="Comunidad" lang={lang} />
                  </label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => update("community", e.target.value)}
                    placeholder={ph("e.g. El Mirador, Solola", "ej. El Mirador, Solola", lang)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="Region" es="Region" lang={lang} />
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => update("region", e.target.value)}
                    placeholder={ph("e.g. Solola, Guatemala", "ej. Solola, Guatemala", lang)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>
                    <BLabel en="People Served" es="Personas Beneficiadas" lang={lang} />
                  </label>
                  <input
                    type="number"
                    value={formData.peopleServed}
                    onChange={(e) => update("peopleServed", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="Students" es="Estudiantes" lang={lang} />
                  </label>
                  <input
                    type="number"
                    value={formData.studentsImpacted}
                    onChange={(e) => update("studentsImpacted", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="Cost (USD)" es="Costo (USD)" lang={lang} />
                  </label>
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
              <label className={labelClass}>
                <BLabel en="Select Project" es="Seleccionar Proyecto" lang={lang} />
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => update("projectId", e.target.value)}
                className={inputClass}
              >
                <option value="">{lang === "es" ? "Elige un proyecto..." : "Choose a project..."}</option>
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
            📖 <BLabel en="The Story" es="La Historia" lang={lang} />
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            <BLabel
              en="Tell us what's happening on the ground. Write in whatever language feels natural."
              es="Cuentanos lo que esta pasando. Escribe en el idioma que te resulte mas natural."
              lang={lang}
            />
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>{lang === "es" ? "Consejo:" : "Tip:"}</strong>{" "}
              <BLabel
                en="Don't worry about writing perfectly. Just share what you see, hear, and feel. AI will help polish it later."
                es="No te preocupes por escribir perfecto. Solo comparte lo que ves, escuchas y sientes. La IA lo pulira despues."
                lang={lang}
              />
            </p>
          </div>

          <div className="mb-4">
            <label className={labelClass}>
              <BLabel
                en="What challenge does the community face?"
                es="Que desafio enfrenta la comunidad?"
                lang={lang}
              />
            </label>
            <textarea
              value={formData.challenge}
              onChange={(e) => update("challenge", e.target.value)}
              placeholder={ph("Describe the problem or need...", "Describe el problema o la necesidad...", lang)}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>
              <BLabel
                en="What is being done to solve it?"
                es="Que se esta haciendo para resolverlo?"
                lang={lang}
              />
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => update("solution", e.target.value)}
              placeholder={ph("Describe the project's approach...", "Describe como el proyecto aborda el problema...", lang)}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>
              <BLabel
                en="What will be different now?"
                es="Que sera diferente ahora?"
                lang={lang}
              />
            </label>
            <textarea
              value={formData.brighterFuture}
              onChange={(e) => update("brighterFuture", e.target.value)}
              placeholder={ph("Describe the impact or expected outcome...", "Describe el impacto o resultado esperado...", lang)}
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Personal story toggle */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">
                  <BLabel en="Add a Personal Story" es="Agregar una Historia Personal" lang={lang} />
                </h3>
                <p className="text-sm text-gray-500">
                  <BLabel
                    en="A personal story makes the biggest impact on donors."
                    es="Una historia personal tiene el mayor impacto en los donantes."
                    lang={lang}
                  />
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
                    <label className={labelClass}>
                      <BLabel en="Name" es="Nombre" lang={lang} />
                    </label>
                    <input
                      type="text"
                      value={formData.personalName}
                      onChange={(e) => update("personalName", e.target.value)}
                      placeholder={ph("e.g. Maria Elena", "ej. Maria Elena", lang)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <BLabel en="Age" es="Edad" lang={lang} />
                    </label>
                    <input
                      type="number"
                      value={formData.personalAge}
                      onChange={(e) => update("personalAge", e.target.value)}
                      placeholder={ph("e.g. 8", "ej. 8", lang)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="Their story" es="Su historia" lang={lang} />
                  </label>
                  <textarea
                    value={formData.personalBackground}
                    onChange={(e) =>
                      update("personalBackground", e.target.value)
                    }
                    placeholder={ph(
                      "Who are they? How does this project affect their life?",
                      "Quien es? Como afecta este proyecto su vida?",
                      lang
                    )}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <BLabel en="A quote from them (in their words)" es="Una cita de ellos (en sus palabras)" lang={lang} />
                  </label>
                  <input
                    type="text"
                    value={formData.personalQuote}
                    onChange={(e) => update("personalQuote", e.target.value)}
                    placeholder={ph(
                      'e.g. "Now I can drink water at school..."',
                      'ej. "Ahora puedo tomar agua en la escuela..."',
                      lang
                    )}
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
            📸 <BLabel en="Photos & Details" es="Fotos y Detalles" lang={lang} />
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            <BLabel
              en="Upload photos from the field. The first photo will be the main image."
              es="Sube fotos del campo. La primera foto sera la imagen principal."
              lang={lang}
            />
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
                    {lang === "es" ? "Principal" : "Main"}
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
              <span className="text-xs text-gray-400">
                {lang === "es" ? "Agregar Foto" : "Add Photo"}
              </span>
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
            <label className={labelClass}>
              <BLabel en="Additional Notes" es="Notas Adicionales" lang={lang} />
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => update("additionalNotes", e.target.value)}
              placeholder={ph(
                "Any additional details you want to share...",
                "Cualquier detalle adicional que quieras compartir...",
                lang
              )}
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
            ✅ <BLabel en="Review & Submit" es="Revisar y Enviar" lang={lang} />
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                <BLabel en="Project" es="Proyecto" lang={lang} />
              </h3>
              <p className="font-medium text-gray-900">
                {formData.isNewProject
                  ? `🆕 ${formData.projectName || (lang === "es" ? "Sin nombre" : "Unnamed")}`
                  : `🔄 ${projects.find((p) => p.id === formData.projectId)?.title || (lang === "es" ? "No seleccionado" : "Not selected")}`}
              </p>
              {formData.isNewProject && (
                <p className="text-sm text-gray-500 mt-1">
                  {formData.projectType} - {formData.community} -{" "}
                  {formData.status}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                <BLabel en="Story" es="Historia" lang={lang} />
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  {formData.challenge ? "✅" : "⬜"}{" "}
                  <BLabel en="Challenge described" es="Desafio descrito" lang={lang} />
                </p>
                <p>
                  {formData.solution ? "✅" : "⬜"}{" "}
                  <BLabel en="Solution described" es="Solucion descrita" lang={lang} />
                </p>
                <p>
                  {formData.brighterFuture ? "✅" : "⬜"}{" "}
                  <BLabel en="Impact described" es="Impacto descrito" lang={lang} />
                </p>
              </div>
            </div>

            {formData.hasPersonalStory && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-emerald-700 mb-1">
                  <BLabel en="Personal Story" es="Historia Personal" lang={lang} />
                </h3>
                <p className="font-medium text-gray-900">
                  {formData.personalName}, {lang === "es" ? "edad" : "age"} {formData.personalAge}
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
                <BLabel en="Photos" es="Fotos" lang={lang} />
              </h3>
              <p className="text-sm text-gray-900">
                {photos.length} {lang === "es" ? "foto" : "photo"}{photos.length !== 1 ? "s" : ""}{" "}
                {lang === "es" ? "adjuntas" : "attached"}
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
          {step === 0
            ? (lang === "es" ? "Cancelar" : "Cancel")
            : (lang === "es" ? "Atras" : "Back")}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {lang === "es" ? "Siguiente" : "Next"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting
              ? (lang === "es" ? "Enviando..." : "Submitting...")
              : (lang === "es" ? "Enviar Actualizacion" : "Submit Update")}
          </button>
        )}
      </div>
    </div>
  );
}
