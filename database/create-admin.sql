-- Create Initial Admin User for Teamify
-- This script creates an admin user in the database
-- The admin must be created in Supabase Auth dashboard first

-- STEP 1: Create Admin via Supabase Dashboard
-- Go to Authentication → Users → Add User
-- Email: admin@teamify.com  
-- Password: (set a secure password)
-- Auto Confirm User: YES

-- STEP 2: Run this script to create the admin in users table
-- Replace 'admin@teamify.com' with the actual email you used

INSERT INTO users (
  fullname,
  email,
  passwordhash,
  orgid,
  clientid,
  roleid,
  status,
  isactive,
  createdat,
  updatedat
)
VALUES (
  'System Administrator',
  'admin@teamify.com',  -- CHANGE THIS to match Supabase Auth email
  'MANAGED_BY_SUPABASE_AUTH',
  1,  -- Default Organization
  1,  -- Default Client
  1,  -- Admin Role (roleid=1)
  'Active',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (orgid, clientid, email) DO UPDATE 
SET 
  roleid = 1,
  status = 'Active',
  isactive = true;

-- STEP 3: Verify the admin was created
SELECT 
  u.userid,
  u.fullname,
  u.email,
  r.rolename as role,
  o.orgname as organization,
  c.clientname as client,
  u.status
FROM users u
JOIN roles r ON u.roleid = r.roleid
LEFT JOIN organizations o ON u.orgid = o.orgid
LEFT JOIN clients c ON u.clientid = c.clientid
WHERE u.email = 'admin@teamify.com';  -- CHANGE THIS to match your email

-- Now you can login with:
-- Email: admin@teamify.com
-- Password: (the password you set in Supabase Auth)
