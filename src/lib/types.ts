export interface Project {
  id: string;
  title: string;
  title_es: string | null;
  type: string;
  status: "planning" | "in_progress" | "completed";
  community: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  people_served: number;
  students_impacted: number;
  cost: number;
  funded: number;
  hero_image_url: string | null;
  community_context: string | null;
  community_population: number | null;
  school_name: string | null;
  school_size: number | null;
  grades_served: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  submitted_by: string | null;
  field_notes: string | null;
  field_notes_en: string | null;
  personal_story_name: string | null;
  personal_story_age: number | null;
  personal_story_quote: string | null;
  personal_story_quote_en: string | null;
  personal_story: string | null;
  personal_story_after: string | null;
  ai_generated_narrative: string | null;
  review_status: string;
  created_at: string;
}

export interface UpdatePhoto {
  id: string;
  update_id: string;
  photo_url: string;
  caption: string | null;
  is_hero: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "field_team" | "editor" | "admin";
  avatar_url: string | null;
  preferred_language: "es" | "en";
  phone: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}
