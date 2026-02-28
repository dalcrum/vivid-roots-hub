-- ============================================
-- VIVID ROOTS HUB — Seed Data
-- Run this in the Supabase SQL Editor
-- ============================================

-- Insert sample projects
INSERT INTO public.projects (id, title, title_es, type, status, community, region, latitude, longitude, people_served, students_impacted, cost, funded, hero_image_url, community_context, started_at, completed_at)
VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Escuela Primaria El Mirador — Clean Water System',
  'Escuela Primaria El Mirador — Sistema de Agua Limpia',
  'Clean Water',
  'completed',
  'El Mirador, Sololá',
  'Sololá, Guatemala',
  14.7667,
  -91.1833,
  247,
  89,
  4200,
  4200,
  'https://images.unsplash.com/photo-1706645740995-d3ab4b91f4fa?w=1200&q=80',
  'El Mirador sits at 2,300 meters elevation in the highlands of Sololá, one of Guatemala''s most indigenous departments. The community of roughly 250 people is predominantly Kaqchikel Maya. Most families depend on subsistence farming — corn, beans, and small coffee plots. The nearest health clinic is a 45-minute drive on unpaved roads. Access to clean water has been a persistent challenge, with only 34% of rural households in the region having reliable access to treated water.',
  '2025-11-15',
  '2026-01-20'
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Aldea Nueva Esperanza — School Roof Repair',
  'Aldea Nueva Esperanza — Reparación de Techo Escolar',
  'Education',
  'in_progress',
  'Nueva Esperanza, Chimaltenango',
  'Chimaltenango, Guatemala',
  14.6347,
  -90.8164,
  156,
  62,
  3800,
  2900,
  'https://images.unsplash.com/photo-1765994898026-4fa84ade4a61?w=1200&q=80',
  'Nueva Esperanza is a small aldea of approximately 156 residents in rural Chimaltenango. The community was established in 1998 by families displaced during Guatemala''s internal conflict. Education is deeply valued here — parents formed a committee specifically to advocate for school improvements, meeting monthly to discuss needs and coordinate with organizations like Vivid Roots.',
  '2026-01-10',
  NULL
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Comunidad San Marcos — Health Station',
  'Comunidad San Marcos — Puesto de Salud',
  'Health',
  'completed',
  'San Marcos La Laguna',
  'Sololá, Guatemala',
  14.7228,
  -91.2561,
  410,
  0,
  6500,
  6500,
  'https://images.unsplash.com/photo-1722963220454-6650d75488ef?w=1200&q=80',
  'San Marcos La Laguna is a small lakeside town on the shores of Lake Atitlán, home to approximately 3,000 residents, most of whom are Tz''utujil Maya. The town is accessible primarily by boat or a single winding road. Before the health station, residents needing medical care had to travel by lancha (boat) to Panajachel — a 30-minute ride across the lake that costs more than most families earn in a day.',
  '2025-06-01',
  '2025-09-15'
);

-- Insert project updates with personal stories
INSERT INTO public.project_updates (id, project_id, field_notes, field_notes_en, personal_story_name, personal_story_age, personal_story_quote, personal_story_quote_en, personal_story, personal_story_after, ai_generated_narrative, review_status)
VALUES
(
  'b1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'La comunidad estuvo increíblemente involucrada. Don Pedro, el líder comunitario, organizó turnos de trabajo voluntario. Los padres de familia ayudaron a cavar las zanjas para la tubería. Fue hermoso ver cómo toda la comunidad se unió para este proyecto.',
  'The community was incredibly involved. Don Pedro, the community leader, organized volunteer work shifts. The parents helped dig trenches for the piping. It was beautiful to see how the whole community came together for this project.',
  'María Elena',
  8,
  'Ahora puedo tomar agua en la escuela sin que me duela el estómago.',
  'Now I can drink water at school without my stomach hurting.',
  'María Elena walks 2.3 kilometers each morning along a dirt path that winds through coffee fields to reach Escuela Primaria El Mirador. For the past three years, she and her 88 classmates shared a single water source — an untreated well behind the school kitchen that had been flagged by local health workers for dangerous bacteria levels. The children often complained of stomach pain. Some missed days of school. María Elena''s mother, Doña Carmen, would send her with a small bottle of water from home, but it was never enough for a full day under the Guatemalan sun.',
  'Today, María Elena runs straight to the new water station during recess. The filtration system, installed by community volunteers alongside the Vivid Roots team, serves all 89 students and 12 staff members with clean, safe drinking water. Stomach complaints have dropped dramatically. Attendance is up. And María Elena no longer needs to carry that small bottle from home — though her mother still sometimes tucks one in her backpack, just out of habit.',
  NULL,
  'published'
),
(
  'b1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'El progreso va bien! Los materiales llegaron la semana pasada. La comunidad ya empezó con la mano de obra. El director de la escuela está muy emocionado.',
  'Progress is going well! Materials arrived last week. The community has already started with the labor. The school principal is very excited.',
  'Carlos',
  11,
  'Cuando llueve ya no tenemos que mover los escritorios.',
  'When it rains we don''t have to move our desks anymore.',
  'During Guatemala''s rainy season — May through October — Carlos and his classmates would rearrange their desks multiple times a day, trying to avoid the streams of water pouring through holes in the corrugated metal roof. Some days, when the storms were too heavy, classes would simply stop. Teachers estimated they lost nearly 3 weeks of instruction time each rainy season to roof leaks alone.',
  'The project is currently 76% complete. New roofing panels have been installed over the two most damaged classrooms, and work continues on the remaining sections. Carlos already notices the difference.',
  NULL,
  'published'
),
(
  'b1b2c3d4-0003-4000-8000-000000000003',
  'a1b2c3d4-0003-4000-8000-000000000003',
  'El puesto de salud está funcionando completamente. La enfermera viene tres veces por semana. Las familias ya no tienen que cruzar el lago para consultas básicas.',
  'The health station is fully operational. The nurse comes three times a week. Families no longer have to cross the lake for basic consultations.',
  'Doña Lucía',
  67,
  'Ya no tengo miedo cuando mis nietos se enferman de noche.',
  'I am no longer afraid when my grandchildren get sick at night.',
  'Doña Lucía has lived in San Marcos La Laguna her entire life. As a traditional midwife, she has delivered over 200 babies in the community. But when medical emergencies arose — a child with a high fever, an elder with chest pain — the only option was the dangerous nighttime boat ride across Lake Atitlán to Panajachel. More than once, she watched families delay seeking care because they feared the crossing.',
  'The new health station, built with local materials and staffed by a rotating nurse from the regional health department, now provides basic medical care, vaccinations, and emergency stabilization. Doña Lucía volunteers at the station three mornings a week, bridging traditional and modern medicine for her community.',
  NULL,
  'published'
);

-- Insert sample photos
INSERT INTO public.update_photos (update_id, photo_url, caption, is_hero)
VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1706645740995-d3ab4b91f4fa?w=600&q=80', 'The new water filtration system', true),
('b1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1591123631256-5d6f560380b0?w=600&q=80', 'Community volunteers during installation', false),
('b1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=600&q=80', 'Students at the water station', false),
('b1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/photo-1765994898026-4fa84ade4a61?w=600&q=80', 'Roof repair in progress', true),
('b1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/flagged/photo-1564308501991-072c27259ba4?w=600&q=80', 'Classroom before repairs', false),
('b1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1722963220454-6650d75488ef?w=600&q=80', 'The new health station', true),
('b1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1669176877597-da92c8a5bbfa?w=600&q=80', 'Doña Lucía at the station', false);
