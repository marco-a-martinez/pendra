-- This SQL should be run in the Supabase SQL editor to set up testing
-- WARNING: Only use this for development/testing!

-- Create a test user that bypasses auth.users reference
-- First, we need to temporarily disable the foreign key constraint
-- This is a workaround for testing without proper auth

-- Option 1: Insert a test user (if you have admin access)
-- INSERT INTO auth.users (id, email, created_at, updated_at)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', NOW(), NOW());

-- Option 2: Create a policy that allows anonymous users to create their own profile
-- This is safer for testing
CREATE POLICY "Allow anonymous to create test user" ON users
  FOR INSERT
  WITH CHECK (id = '550e8400-e29b-41d4-a716-446655440000');

-- Then insert the test user
INSERT INTO users (id, email, name, avatar_url)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'test@example.com',
  'Test User',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow the test user to manage their own tasks
CREATE POLICY "Test user can manage own tasks" ON tasks
  FOR ALL
  USING (user_id = '550e8400-e29b-41d4-a716-446655440000');
