-- Instructions for creating the demo user
-- This needs to be done through the Supabase Auth API or dashboard

-- Method 1: Using Supabase Dashboard
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user"
-- 3. Enter:
--    Email: demo@taskvault.com
--    Password: demo123456
--    Email Confirm: true
-- 4. Copy the generated user ID
-- 5. Update the demo data script with the actual user ID

-- Method 2: Using Supabase CLI or API
-- You can also create the user programmatically:

-- Example API call (replace YOUR_SERVICE_ROLE_KEY):
/*
curl -X POST 'https://your-project.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "demo@taskvault.com",
  "password": "demo123456",
  "email_confirm": true,
  "user_metadata": {
    "username": "Demo User"
  }
}'
*/

-- After creating the user, update the demo data with the actual user ID
-- Replace '00000000-0000-0000-0000-000000000001' in the demo data script
-- with the actual UUID generated for the demo user
