# Database Setup Instructions

Follow these steps to set up your Supabase database for Teamify.

## Step 1: Create Database Tables

Run the main schema SQL script in your Supabase SQL Editor:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pyavozssehdrnmuatcym
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire schema from your database script
5. Click **RUN**

## Step 2: Create Sample Data

After creating the tables, add some sample data:

```sql
-- Create a sample client
INSERT INTO clients (clientname, orgid, createdat, updatedat) 
VALUES ('Default Client', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create a sample organization
INSERT INTO organizations (orgid, orgname, address, contactemail, createdat, updatedat)
VALUES (1, 'Default Organization', '123 Main St', 'admin@teamify.com', NOW(), NOW())
ON CONFLICT DO NOTHING;
```

## Step 3: Set Up Row Level Security (RLS)

Run the RLS policies script (`rls-policies.sql`) in your Supabase SQL Editor:

1. Go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire content from `rls-policies.sql`
4. Click **RUN**

## Step 4: Disable Email Confirmation (For Development)

For easier testing during development:

1. Go to **Authentication** → **Providers** → **Email**
2. **Uncheck "Confirm email"**
3. Click **Save**

## Step 5: Update Environment Variables

Make sure your `.env` file has the correct values:

```env
VITE_SUPABASE_PROJECT_ID="pyavozssehdrnmuatcym"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://pyavozssehdrnmuatcym.supabase.co"
```

## Step 6: Restart Your Development Server

```bash
npm run dev
```

## Troubleshooting

### "Failed to fetch" error

This usually means:
1. RLS policies aren't set up correctly
2. The tables don't exist
3. The Supabase URL/keys are incorrect

### Users table INSERT fails

Make sure:
1. A client with `clientid=1` exists
2. An organization with `orgid=1` exists
3. RLS policy for INSERT on users table is set up

### Can't read user data after login

Check:
1. The user record exists in the `users` table
2. RLS policies allow SELECT on users table
3. Browser console for specific errors

## Verification

To verify everything is working:

1. Try signing up with a new email
2. Check the `users` table in Supabase to see if the record was created
3. Try signing in
4. You should be redirected to the dashboard

## Multi-Tenant Setup

For production with multiple clients:

1. Create proper clients and organizations
2. Update the signup flow to allow client/org selection
3. Implement proper role-based access control
4. Set up admin interfaces for managing clients and organizations
