# Role-Based Access Control (RBAC)

Teamify implements a role-based permissions system with three primary roles:

## Roles Overview

### 1. Admin (roleid: 1)
**Full system access** - The admin has complete control over all features.

**Permissions:**
- ✅ View Dashboard
- ✅ View Employees
- ✅ **Create Employees**
- ✅ **Edit Employees**
- ✅ **Delete Employees**
- ✅ View Attendance
- ✅ **Edit Attendance** (All users)
- ✅ View Reports
- ✅ Manage Settings
- ✅ Manage Roles
- ✅ Manage Organization

### 2. HR (roleid: 2)
**Human Resources** - Can manage employees and attendance.

**Permissions:**
- ✅ View Dashboard
- ✅ View Employees
- ✅ **Create Employees**
- ✅ **Edit Employees**
- ❌ Delete Employees
- ✅ View Attendance
- ✅ **Edit Attendance** (All users)
- ✅ View Reports
- ❌ Manage Settings
- ❌ Manage Roles
- ❌ Manage Organization

### 3. Employee (roleid: 3)
**Regular Employee** - Limited access to own data.

**Permissions:**
- ✅ View Dashboard
- ✅ View Employees
- ❌ Create Employees
- ❌ Edit Employees
- ❌ Delete Employees
- ✅ View Attendance (Own only)
- ❌ Edit Attendance
- ❌ View Reports
- ❌ Manage Settings
- ❌ Manage Roles
- ❌ Manage Organization

## Implementation

### Permissions Utility
Located at: `src/utils/permissions.ts`

```typescript
import { canCreateEmployee, canEditAttendance, isAdmin, isHR } from '@/utils/permissions';

// Check if user can create employees
const hasCreatePermission = canCreateEmployee(user.roleid); // true for Admin & HR

// Check if user can edit attendance
const hasEditPermission = canEditAttendance(user.roleid); // true for Admin & HR

// Check specific roles
const isAdminUser = isAdmin(user.roleid);
const isHRUser = isHR(user.roleid);
```

### UI Implementation Examples

#### Employees Page
```tsx
import { canCreateEmployee } from '@/utils/permissions';

const hasCreatePermission = user?.roleid ? canCreateEmployee(user.roleid) : false;

{hasCreatePermission && (
  <Button onClick={() => setShowModal(true)}>
    <UserPlus className="mr-2 h-4 w-4" />
    Add Employee
  </Button>
)}
```

#### Attendance Page
```tsx
import { canEditAttendance } from '@/utils/permissions';

const hasEditPermission = user?.roleid ? canEditAttendance(user.roleid) : false;

{hasEditPermission && (
  <Button onClick={() => setEditingRecord(record)}>
    <Edit className="h-4 w-4" />
  </Button>
)}
```

## Database Setup

### 1. Create Roles
Run `database/setup-roles.sql` in Supabase SQL Editor:

```sql
INSERT INTO roles (roleid, rolename, description, isactive)
VALUES 
  (1, 'Admin', 'Full system access', true),
  (2, 'HR', 'Can create employees and edit attendance', true),
  (3, 'Employee', 'Regular employee', true);
```

### 2. Assign Roles to Users
```sql
-- Make a user an Admin
UPDATE users SET roleid = 1 WHERE email = 'admin@example.com';

-- Make a user HR
UPDATE users SET roleid = 2 WHERE email = 'hr@example.com';

-- Make a user an Employee
UPDATE users SET roleid = 3 WHERE email = 'employee@example.com';
```

## Creating Admin Account

Follow the steps in `database/create-admin.sql`:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Run SQL to insert into users table:
```sql
INSERT INTO users (
  fullname, email, passwordhash, orgid, clientid, roleid, status, isactive
) VALUES (
  'System Admin', 'admin@example.com', 'MANAGED_BY_AUTH', 1, 1, 1, 'Active', true
);
```

## User Creation Workflow (Admin/HR)

When Admin or HR creates an employee:

1. **Fill out Employee Form** (in UI)
   - Full Name
   - Email
   - Password (auto-generate or manual)
   - Role (Admin/HR/Employee)

2. **Employee Record Created** (automatic)
   - Record inserted into `users` table
   - Status set to "Active"

3. **Manual Auth Setup** (required)
   - Admin must go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Use the same email from step 1
   - Set the password (shown in the UI)
   - This allows the employee to sign in

> **Note**: The manual auth step is temporary. A future update will use Supabase Edge Functions with the Service Role key to automate auth user creation.

## Features by Role

| Feature | Admin | HR | Employee |
|---------|-------|----|---------| 
| View Dashboard | ✅ | ✅ | ✅ |
| View All Employees | ✅ | ✅ | ✅ |
| Add Employee | ✅ | ✅ | ❌ |
| Edit Employee | ✅ | ✅ | ❌ |
| Delete Employee | ✅ | ❌ | ❌ |
| Check In/Out (Self) | ✅ | ✅ | ✅ |
| Edit Any Attendance | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ❌ |
| Manage Organization | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |

## Future Enhancements

1. **Automated Auth User Creation**
   - Implement Supabase Edge Function
   - Use Service Role key for auth.admin.createUser()
   - Eliminate manual auth setup step

2. **Department-Level Permissions**
   - HR can only manage employees in their department
   - Department-specific attendance editing

3. **Fine-Grained Permissions**
   - Custom role permissions using `role_permissions` table
   - Permission keys for each feature

4. **Audit Logging**
   - Track who made what changes
   - Use existing `audit_log` table

## Security Notes

- Never expose the Service Role key in frontend code
- Always validate permissions on both frontend AND backend (RLS policies)
- Use Supabase RLS policies to enforce database-level security
- Frontend permissions are for UI only, not security
