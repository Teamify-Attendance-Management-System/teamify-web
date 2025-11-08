-- Setup Roles for Teamify
-- This script ensures the roles table has the correct data
-- Role IDs: 1 = Admin, 2 = HR, 3 = Employee

-- Insert default roles (if they don't exist)
INSERT INTO roles (roleid, rolename, description, isactive, createdat, updatedat)
VALUES 
  (1, 'Admin', 'Full system access with all permissions', true, NOW(), NOW()),
  (2, 'HR', 'Human Resources - Can create employees and edit attendance', true, NOW(), NOW()),
  (3, 'Employee', 'Regular employee with limited access', true, NOW(), NOW())
ON CONFLICT (roleid) DO UPDATE 
SET 
  rolename = EXCLUDED.rolename,
  description = EXCLUDED.description,
  isactive = EXCLUDED.isactive,
  updatedat = NOW();

-- Verify roles
SELECT roleid, rolename, description, isactive FROM roles ORDER BY roleid;

-- Example: Update existing users to have correct roles
-- Uncomment and modify as needed:

-- Update a user to Admin role
-- UPDATE users SET roleid = 1 WHERE email = 'admin@example.com';

-- Update a user to HR role
-- UPDATE users SET roleid = 2 WHERE email = 'hr@example.com';

-- Update a user to Employee role
-- UPDATE users SET roleid = 3 WHERE email = 'employee@example.com';
