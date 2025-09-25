-- Setup Admin Users for E-commerce Application
-- Run this script in your Supabase SQL Editor

-- First, let's check if the users table exists and what's in it
SELECT 'Checking users table...' as status;
SELECT COUNT(*) as user_count FROM users;

-- Check if there are any existing users
SELECT 'Existing users:' as info;
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
ORDER BY created_at;

-- Temporarily disable RLS for user creation (if needed)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Clear existing admin users (optional - remove if you want to keep existing data)
-- DELETE FROM users WHERE email IN ('admin@example.com', 'manager@example.com');

-- Insert admin users with proper password hashes
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
-- Admin user (password: admin123)
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'owner', true),
-- Manager user (password: manager123)
('manager@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 'User', 'developer', true),
-- Additional admin user (password: admin123)
('admin@eshop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'E-Shop', 'Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Re-enable RLS (if we disabled it)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the users were created/updated
SELECT 'Users after setup:' as info;
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    is_active, 
    created_at,
    updated_at
FROM users 
ORDER BY created_at;

-- Check RLS policies on users table
SELECT 'RLS Policies on users table:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';

-- Test if we can query users (this will show if RLS is blocking access)
SELECT 'Testing user access...' as status;
SELECT COUNT(*) as accessible_users FROM users;

-- If you're still having issues, try this to check RLS status
SELECT 'RLS Status:' as info;
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Show current user context (helpful for debugging)
SELECT 'Current context:' as info;
SELECT current_user, session_user, current_database();

