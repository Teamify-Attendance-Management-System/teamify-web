-- Quick Setup Script for Teamify
-- Run this in Supabase SQL Editor to set up default data

-- 1. Create default client
INSERT INTO clients (clientid, clientname, createdat, updatedat)
VALUES (1, 'Default Client', NOW(), NOW())
ON CONFLICT (clientid) DO UPDATE 
SET clientname = EXCLUDED.clientname;

-- 2. Create default organization
INSERT INTO organizations (orgid, clientid, orgname, address, contactemail, createdat, updatedat)
VALUES (1, 1, 'Default Organization', '123 Main Street', 'admin@teamify.com', NOW(), NOW())
ON CONFLICT (orgid) DO UPDATE 
SET orgname = EXCLUDED.orgname, clientid = EXCLUDED.clientid;

-- 3. Verify the setup
SELECT 'Clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles;

-- 4. Show the default data
SELECT c.clientid, c.clientname, o.orgid, o.orgname, o.contactemail
FROM clients c
LEFT JOIN organizations o ON o.clientid = c.clientid
WHERE c.clientid = 1;
