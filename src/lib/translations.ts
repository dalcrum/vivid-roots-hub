// Bilingual labels for the admin dashboard
// Spanish users see: Spanish (primary) + English (small subtitle)
// English users see: English only

export const t = {
  // Sidebar
  dashboard: { en: "Dashboard", es: "Panel" },
  projects: { en: "Projects", es: "Proyectos" },
  newUpdate: { en: "New Update", es: "Nueva Actualización" },
  team: { en: "Team", es: "Equipo" },
  signOut: { en: "Sign Out", es: "Cerrar Sesión" },

  // Dashboard
  welcomeBack: { en: "Welcome back", es: "Bienvenido" },
  overview: { en: "Overview", es: "Resumen" },
  activeProjects: { en: "Active Projects", es: "Proyectos Activos" },
  totalUpdates: { en: "Total Updates", es: "Actualizaciones Totales" },
  teamMembers: { en: "Team Members", es: "Miembros del Equipo" },
  photosUploaded: { en: "Photos Uploaded", es: "Fotos Subidas" },
  quickActions: { en: "Quick Actions", es: "Acciones Rápidas" },
  submitUpdate: { en: "Submit Field Update", es: "Enviar Actualización" },
  recentUpdates: { en: "Recent Updates", es: "Actualizaciones Recientes" },

  // Field Input Form
  basicInfo: { en: "Basic Info", es: "Información Básica" },
  theStory: { en: "The Story", es: "La Historia" },
  photos: { en: "Photos", es: "Fotos" },
  previewSubmit: { en: "Preview & Submit", es: "Revisar y Enviar" },
  projectName: { en: "Project Name", es: "Nombre del Proyecto" },
  community: { en: "Community", es: "Comunidad" },
  projectType: { en: "Project Type", es: "Tipo de Proyecto" },
  status: { en: "Status", es: "Estado" },
  challenge: { en: "The Challenge", es: "El Desafío" },
  solution: { en: "The Solution", es: "La Solución" },
  brighterFuture: { en: "A Brighter Future", es: "Un Futuro Mejor" },
  personalStory: { en: "Personal Story", es: "Historia Personal" },
  next: { en: "Next", es: "Siguiente" },
  back: { en: "Back", es: "Atrás" },
  submit: { en: "Submit Update", es: "Enviar Actualización" },
  peopleBenefiting: { en: "People Benefiting", es: "Personas Beneficiadas" },
  fundsUsed: { en: "Funds Used", es: "Fondos Utilizados" },
  selectProject: { en: "Select a project", es: "Seleccionar proyecto" },
  createNew: { en: "Create new project", es: "Crear nuevo proyecto" },
  challengeHint: {
    en: "What problem does this community face?",
    es: "¿Qué problema enfrenta esta comunidad?",
  },
  solutionHint: {
    en: "What is being done to help?",
    es: "¿Qué se está haciendo para ayudar?",
  },
  futureHint: {
    en: "What will the future look like?",
    es: "¿Cómo será el futuro?",
  },

  // Team
  manageTeam: { en: "Manage your team members and their roles.", es: "Administra los miembros de tu equipo y sus roles." },
  inviteTeamMember: { en: "Invite Team Member", es: "Invitar Miembro" },
  editTeamMember: { en: "Edit Team Member", es: "Editar Miembro" },
  fullName: { en: "Full Name", es: "Nombre Completo" },
  role: { en: "Role", es: "Rol" },
  phone: { en: "Phone", es: "Teléfono" },
  language: { en: "Preferred Language", es: "Idioma Preferido" },
  accountActive: { en: "Account Active", es: "Cuenta Activa" },
  inactiveNote: { en: "Inactive users cannot log in or submit updates.", es: "Usuarios inactivos no pueden iniciar sesión." },
  saveChanges: { en: "Save Changes", es: "Guardar Cambios" },
  backToTeam: { en: "Back to Team", es: "Volver al Equipo" },
  sendInvite: { en: "Send Invite", es: "Enviar Invitación" },
  cancel: { en: "Cancel", es: "Cancelar" },
  edit: { en: "Edit", es: "Editar" },
  email: { en: "Email", es: "Correo Electrónico" },

  // Review & Publish
  reviewUpdates: { en: "Review Updates", es: "Revisar Actualizaciones" },
  editProject: { en: "Edit Project", es: "Editar Proyecto" },
  publish: { en: "Publish", es: "Publicar" },
  sendBack: { en: "Send Back", es: "Devolver" },
  generatePolish: { en: "Generate AI Polish", es: "Generar Pulido con IA" },
  regenerate: { en: "Regenerate", es: "Regenerar" },
  impactStory: { en: "Impact Story", es: "Historia de Impacto" },
  progressSummary: { en: "Progress Summary", es: "Resumen de Progreso" },
  markComplete: { en: "Mark as Complete", es: "Marcar como Completado" },
  projectTimeline: { en: "Project Timeline", es: "Cronologia del Proyecto" },
  aiGenerated: { en: "AI-generated summary", es: "Resumen generado por IA" },
  draft: { en: "Draft", es: "Borrador" },
  inReview: { en: "In Review", es: "En Revision" },
  published: { en: "Published", es: "Publicado" },
  pendingReview: { en: "Pending Review", es: "Pendientes de Revision" },
  rawFieldNotes: { en: "Raw Field Notes", es: "Notas de Campo" },
  aiPolished: { en: "AI-Polished Version", es: "Version Pulida por IA" },

  // Fundraising
  fundraising: { en: "Fundraising", es: "Recaudación" },
} as const;

export type TranslationKey = keyof typeof t;
export type Language = "en" | "es";

// Returns the label for a given key and language
export function label(key: TranslationKey, lang: Language): string {
  return t[key][lang];
}

// Returns primary + subtitle for bilingual display
export function bilingualLabel(
  key: TranslationKey,
  lang: Language
): { primary: string; subtitle: string | null } {
  if (lang === "es") {
    return {
      primary: t[key].es,
      subtitle: t[key].en,
    };
  }
  return {
    primary: t[key].en,
    subtitle: null,
  };
}
