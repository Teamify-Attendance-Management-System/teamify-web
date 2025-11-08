// Supabase Edge Function: Create User
// This function creates a user in both auth.users and the custom users table
// It uses the Service Role key to access admin API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullname, role, orgid, clientid, departmentid, branchid } = await req.json()

    if (!email || !password || !fullname || !role || !orgid || !clientid) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Verify caller role (must be admin or hr)
    const { data: meSession } = await supabaseUser.auth.getUser()
    const callerId = meSession.user?.id
    if (!callerId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }
    const { data: meRows, error: meErr } = await supabaseUser.from('users').select('role').eq('userid', callerId).limit(1)
    if (meErr || !meRows?.length || !['admin','hr'].includes(meRows[0].role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
    }

    // 1) Create user in auth.users
    const { data: created, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullname },
    })
    if (authError || !created?.user) {
      return new Response(
        JSON.stringify({ error: authError?.message ?? 'Failed to create auth user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2) Set app_metadata.role for client-side gating (optional)
    await supabaseAdmin.auth.admin.updateUserById(created.user.id, { app_metadata: { role } })

    // 3) Upsert into public.users with UUID PK link
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .upsert({
        userid: created.user.id,
        email,
        fullname,
        role,
        orgid: parseInt(String(orgid)),
        clientid: parseInt(String(clientid)),
        departmentid: departmentid ? parseInt(String(departmentid)) : null,
        branchid: branchid ? parseInt(String(branchid)) : null,
        status: 'Active',
        isactive: true,
      })
      .select()
      .single()

    if (dbError) {
      // Rollback auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(created.user.id)
      return new Response(
        JSON.stringify({ error: dbError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        authUser: { id: created.user.id, email: created.user.email },
        dbUser,
        message: 'User created successfully in both auth and database'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message ?? String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
