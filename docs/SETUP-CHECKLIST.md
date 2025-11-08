# Role-Based Access Control - Setup Checklist

Follow these steps to set up and test the role-based permissions system.

## ✅ Database Setup

### Step 1: Setup Roles
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Run the script: `database/setup-roles.sql`
- [ ] Verify output shows 3 roles (Admin, HR, Employee)

### Step 2: Verify Default Data
- [ ] Run: `database/quick-setup.sql` (if not already done)
- [ ] Confirm clientid=1 and orgid=1 exist

### Step 3: Create Admin Account

**In Supabase Dashboard:**
- [ ] Go to Authentication → Users
- [ ] Click "Add User"
- [ ] Enter email: `admin@yourcompany.com`
- [ ] Enter password: `[secure password]`
- [ ] Click "Create User"

**In SQL Editor:**
```sql
-- Replace email with your admin email
INSERT INTO users (
  fullname, email, passwordhash, orgid, clientid, roleid, 
  status, isactive, createdat, updatedat
) VALUES (
  'System Administrator', 
  'admin@yourcompany.com', 
  'MANAGED_BY_AUTH', 
  1, 
  1, 
  1, -- Admin role
  'Active', 
  true,
  NOW(),
  NOW()
);
```

- [ ] Run the SQL script
- [ ] Verify: `SELECT * FROM users WHERE roleid = 1;`

## ✅ Application Testing

### Test 1: Admin Access
- [ ] Sign in with admin credentials
- [ ] Navigate to Employees page
- [ ] Verify "Add Employee" button is visible
- [ ] Navigate to Attendance page
- [ ] Verify edit buttons (pencil icon) are visible in attendance history
- [ ] Dashboard should show all data

### Test 2: Create HR User

**As Admin:**
- [ ] Click "Add Employee" button
- [ ] Fill in form:
  - Full Name: `HR Manager`
  - Email: `hr@yourcompany.com`
  - Click "Generate" for password (copy it!)
  - Role: Select "HR"
- [ ] Click "Create Employee"
- [ ] Note the generated password

**In Supabase Dashboard:**
- [ ] Go to Authentication → Users
- [ ] Click "Add User"
- [ ] Enter email: `hr@yourcompany.com`
- [ ] Enter the same password from above
- [ ] Click "Create User"

**Test HR Login:**
- [ ] Sign out
- [ ] Sign in as HR user
- [ ] Verify "Add Employee" button is visible
- [ ] Verify attendance edit buttons are visible
- [ ] All features should work like Admin

### Test 3: Create Employee User

**As Admin or HR:**
- [ ] Click "Add Employee" button
- [ ] Fill in form:
  - Full Name: `Regular Employee`
  - Email: `employee@yourcompany.com`
  - Click "Generate" for password (copy it!)
  - Role: Select "Employee"
- [ ] Click "Create Employee"

**In Supabase Dashboard:**
- [ ] Go to Authentication → Users
- [ ] Click "Add User"
- [ ] Enter email: `employee@yourcompany.com`
- [ ] Enter the same password
- [ ] Click "Create User"

**Test Employee Login:**
- [ ] Sign out
- [ ] Sign in as Employee user
- [ ] Verify "Add Employee" button is NOT visible
- [ ] Verify attendance edit buttons are NOT visible
- [ ] Employee can check in/out for themselves
- [ ] Employee can view dashboard and employee list

## ✅ Feature Verification

### Admin Features
- [ ] Can view dashboard
- [ ] Can see all employees
- [ ] Can add new employees
- [ ] Can edit attendance for any user
- [ ] Can check in/out for themselves

### HR Features
- [ ] Can view dashboard
- [ ] Can see all employees
- [ ] Can add new employees
- [ ] Can edit attendance for any user
- [ ] Can check in/out for themselves
- [ ] Cannot see system settings (when implemented)

### Employee Features
- [ ] Can view dashboard
- [ ] Can see all employees (read-only)
- [ ] Cannot add employees
- [ ] Cannot edit any attendance
- [ ] Can check in/out for themselves only
- [ ] Can view their own attendance history

## 🔍 Troubleshooting

### "Add Employee" button not showing for Admin/HR
- Check user's roleid: `SELECT roleid FROM users WHERE email = 'your@email.com';`
- Should be 1 (Admin) or 2 (HR)
- If wrong: `UPDATE users SET roleid = 1 WHERE email = 'your@email.com';`

### User can't sign in after creation
- Verify auth user exists in Supabase Dashboard → Authentication → Users
- Verify database user exists: `SELECT * FROM users WHERE email = 'user@email.com';`
- Ensure email matches in both places
- Try password reset if needed

### Edit buttons not showing for Admin/HR
- Check roleid in database
- Check browser console for errors
- Verify `src/utils/permissions.ts` is imported correctly

### Permissions not working
- Clear browser cache and reload
- Sign out and sign in again
- Check browser console for TypeScript errors
- Verify build succeeded: `npm run build`

## 📋 Database Queries for Verification

```sql
-- View all roles
SELECT * FROM roles ORDER BY roleid;

-- View all users with roles
SELECT u.userid, u.fullname, u.email, r.rolename, u.status
FROM users u
LEFT JOIN roles r ON u.roleid = r.roleid
ORDER BY u.roleid, u.fullname;

-- Count users by role
SELECT r.rolename, COUNT(u.userid) as user_count
FROM roles r
LEFT JOIN users u ON r.roleid = u.roleid
GROUP BY r.roleid, r.rolename
ORDER BY r.roleid;

-- View admin users
SELECT userid, fullname, email, status
FROM users
WHERE roleid = 1;

-- View HR users
SELECT userid, fullname, email, status
FROM users
WHERE roleid = 2;

-- View employees
SELECT userid, fullname, email, status
FROM users
WHERE roleid = 3;
```

## ✨ Success Criteria

You've successfully set up RBAC when:

- ✅ Admin can see and use all features
- ✅ HR can create employees and edit attendance
- ✅ Employees have limited access (no create/edit permissions)
- ✅ UI changes based on user role (buttons show/hide)
- ✅ All three roles can sign in and check in/out
- ✅ No console errors or TypeScript warnings

## 🎉 Next Steps

Once RBAC is working:
1. Create more employees with different roles
2. Test attendance editing as HR
3. Test employee creation as HR
4. Verify employees cannot access restricted features
5. Consider implementing department-level permissions
6. Plan for automated auth user creation (Edge Functions)

---

**Need Help?**
- Check `docs/PERMISSIONS.md` for detailed documentation
- Review `docs/RBAC-IMPLEMENTATION.md` for implementation details
- Check browser console for errors
- Verify database with SQL queries above
