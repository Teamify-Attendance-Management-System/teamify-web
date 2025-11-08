-- Row Level Security (RLS) Policies for Teamify
-- Run these commands in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendancerequests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rolepermissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditlog ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROLES table policies (public read)
-- ============================================
CREATE POLICY "Allow public read access to roles"
ON roles FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- ORGANIZATIONS table policies
-- ============================================
CREATE POLICY "Users can read their own organization"
ON organizations FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- CLIENTS table policies
-- ============================================
CREATE POLICY "Users can read their own client"
ON clients FOR SELECT
TO authenticated
USING (
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- USERS table policies
-- ============================================
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON users FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Allow users to read other users in their organization
CREATE POLICY "Users can read users in their organization"
ON users FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
  AND
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (email = auth.jwt() ->> 'email');

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (email = auth.jwt() ->> 'email')
WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================
-- DEPARTMENTS table policies
-- ============================================
CREATE POLICY "Users can read departments in their organization"
ON departments FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
  AND
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- BRANCHES table policies
-- ============================================
CREATE POLICY "Users can read branches in their organization"
ON branches FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
  AND
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- SHIFTS table policies
-- ============================================
CREATE POLICY "Users can read shifts in their organization"
ON shifts FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
  AND
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- ATTENDANCE table policies
-- ============================================
-- Users can read their own attendance
CREATE POLICY "Users can read their own attendance"
ON attendance FOR SELECT
TO authenticated
USING (
  userid IN (
    SELECT userid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- Users can insert their own attendance
CREATE POLICY "Users can insert their own attendance"
ON attendance FOR INSERT
TO authenticated
WITH CHECK (
  userid IN (
    SELECT userid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- Users can update their own attendance
CREATE POLICY "Users can update their own attendance"
ON attendance FOR UPDATE
TO authenticated
USING (
  userid IN (
    SELECT userid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- ATTENDANCE REQUESTS table policies
-- ============================================
CREATE POLICY "Users can read their own attendance requests"
ON attendancerequests FOR SELECT
TO authenticated
USING (
  userid IN (
    SELECT userid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Users can insert their own attendance requests"
ON attendancerequests FOR INSERT
TO authenticated
WITH CHECK (
  userid IN (
    SELECT userid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);

-- ============================================
-- ROLE PERMISSIONS table policies
-- ============================================
CREATE POLICY "Allow authenticated users to read role permissions"
ON rolepermissions FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- AUDIT LOG table policies
-- ============================================
CREATE POLICY "Users can read audit logs for their organization"
ON auditlog FOR SELECT
TO authenticated
USING (
  orgid IN (
    SELECT orgid FROM users WHERE email = auth.jwt() ->> 'email'
  )
  AND
  clientid IN (
    SELECT clientid FROM users WHERE email = auth.jwt() ->> 'email'
  )
);
