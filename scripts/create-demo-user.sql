-- Create demo user in auth.users table
-- Note: This should be run in your Supabase SQL editor or via the Supabase CLI
-- The password will be hashed automatically by Supabase Auth

-- First, let's create the demo user via Supabase Auth API
-- This needs to be done through the Supabase dashboard or API, not direct SQL

-- However, we can prepare the demo data for when the user signs up
-- Create a demo project and tasks that will be associated with the demo user

-- Insert demo project (we'll use a fixed UUID for the demo user)
INSERT INTO projects (
  id,
  user_id,
  name,
  description,
  emoji,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001', -- Demo user ID placeholder
  'Welcome Project',
  'Your first project to get started with TaskVault',
  '🚀',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Get the project ID for demo tasks
-- Insert demo tasks
INSERT INTO tasks (
  id,
  user_id,
  project_id,
  title,
  description,
  status,
  priority,
  is_important,
  emoji,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001', -- Demo user ID placeholder
  (SELECT id FROM projects WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
  'Welcome to TaskVault!',
  'This is your first task. Click the status buttons to change its state.',
  'pending',
  'medium',
  true,
  '👋',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM projects WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
  'Explore the dark theme',
  'Notice the edgy design with glass effects and neon glows.',
  'in_progress',
  'low',
  false,
  '🌙',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM projects WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
  'Add your own tasks',
  'Use the form above to create your own tasks and organize your work.',
  'completed',
  'high',
  false,
  '✅',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM projects WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1),
  'Delete tasks you don''t need',
  'Click the trash icon to remove tasks when you''re done with them.',
  'pending',
  'medium',
  false,
  '🗑️',
  NOW(),
  NOW()
);

-- Insert some checklist items for the first task
INSERT INTO checklist_items (
  id,
  task_id,
  text,
  is_completed,
  created_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM tasks WHERE title = 'Welcome to TaskVault!' AND user_id = '00000000-0000-0000-0000-000000000001'),
  'Sign in to your account',
  true,
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM tasks WHERE title = 'Welcome to TaskVault!' AND user_id = '00000000-0000-0000-0000-000000000001'),
  'Explore the dashboard',
  false,
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM tasks WHERE title = 'Welcome to TaskVault!' AND user_id = '00000000-0000-0000-0000-000000000001'),
  'Try changing task statuses',
  false,
  NOW()
);
