# Create User Edge Function

This Supabase Edge Function creates users in both `auth.users` (for authentication) and the custom `users` table (for application data) in a single atomic operation.

## Features

- ✅ Creates auth user with `auth.admin.createUser()`
- ✅ Creates database user in `users` table
- ✅ Auto-confirms email (no confirmation needed)
- ✅ Transactional: Rolls back auth user if database insert fails
- ✅ Returns both auth and database user data
- ✅ Secure: Uses Service Role key (not exposed to frontend)

## Deployment

### Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

### Deploy the Function

```bash
supabase functions deploy create-user
```

### Set Environment Variables (Already configured)

The function automatically has access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access key

These are automatically provided by Supabase in the Edge Function runtime.

## API Usage

### Endpoint
```
POST https://your-project.supabase.co/functions/v1/create-user
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

### Request Body
```json
{
  "email": "employee@example.com",
  "password": "SecurePassword123!",
  "fullname": "John Doe",
  "roleid": 3,
  "orgid": 1,
  "clientid": 1,
  "departmentid": null,
  "branchid": null
}
```

### Response (Success)
```json
{
  "success": true,
  "authUser": {
    "id": "uuid-here",
    "email": "employee@example.com"
  },
  "dbUser": {
    "userid": 123,
    "fullname": "John Doe",
    "email": "employee@example.com",
    "roleid": 3,
    "status": "Active"
  },
  "message": "User created successfully in both auth and database"
}
```

### Response (Error)
```json
{
  "error": "User already registered"
}
```

## Frontend Integration

The EmployeeCreateModal automatically calls this function:

```typescript
const response = await fetch(
  `${supabase.supabaseUrl}/functions/v1/create-user`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      email,
      password,
      fullname,
      roleid,
      orgid,
      clientid,
    }),
  }
);
```

## Testing

### Test Locally

1. Start Supabase locally:
```bash
supabase start
```

2. Serve the function locally:
```bash
supabase functions serve create-user
```

3. Test with curl:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/create-user' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "test@example.com",
    "password": "Test123456!",
    "fullname": "Test User",
    "roleid": 3,
    "orgid": 1,
    "clientid": 1
  }'
```

### Test in Production

Use the same curl command but replace with your production URL and a real user access token.

## Security

- ✅ Service Role key is never exposed to frontend
- ✅ Function only accessible with valid user session
- ✅ Add RLS policies to restrict who can call this (Admin/HR only)
- ✅ Password requirements can be enforced in the function

## RLS Policy (Recommended)

Add a policy to restrict who can create users:

```sql
-- Only Admin and HR can create users
CREATE POLICY "Admin and HR can create users"
ON users
FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.email = auth.email()
    AND users.roleid IN (1, 2)  -- Admin or HR
  )
);
```

## Troubleshooting

### Function not found
- Ensure you've deployed: `supabase functions deploy create-user`
- Check function exists in Supabase Dashboard → Edge Functions

### Service Role key error
- This is automatically provided by Supabase
- No manual setup needed

### CORS errors
- The function includes CORS headers
- Ensure your app domain is allowed (currently allows all `*`)

### User already exists
- Check if email already exists in `auth.users`
- Use unique emails for each user

## Logs

View function logs in Supabase Dashboard:
1. Go to Edge Functions
2. Click on `create-user`
3. View Logs tab

Or via CLI:
```bash
supabase functions logs create-user
```

## Next Steps

1. Deploy the function: `supabase functions deploy create-user`
2. Test creating a user from the UI
3. Verify user appears in both Auth and Database
4. User can immediately sign in!
