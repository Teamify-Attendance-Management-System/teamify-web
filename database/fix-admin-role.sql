-- Fix Admin User Role
-- This script updates the admin user to have the correct Admin role (roleid = 1)

-- Update the admin user's role to Admin (roleid = 1)
UPDATE users 
SET 
  roleid = 1,
  status = 'Active',
  isactive = true,
  updatedat = NOW()
WHERE email = 'admin@teamify.com';  -- Change this to your admin email

-- Verify the update
SELECT 
  u.userid,
  u.fullname,
  u.email,
  u.roleid,
  r.rolename as role,
  u.status,
  u.isactive
FROM users u
LEFT JOIN roles r ON u.roleid = r.roleid
WHERE u.email = 'admin@teamify.com';  -- Change this to your admin email
