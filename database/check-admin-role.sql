-- Check Admin User's Role
-- Run this in your Supabase SQL Editor to see what role the admin user has

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

-- If the admin has the wrong roleid, run this to fix it:
-- UPDATE users SET roleid = 1 WHERE email = 'admin@teamify.com';
