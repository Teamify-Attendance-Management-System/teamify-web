import { supabase } from "@/integrations/supabase/client";
import { User, UserWithDetails } from "@/types/database";

export const userService = {
  /**
   * Get user by email
   */
  async getUserByEmail(email: string, orgid?: number, clientid?: number): Promise<UserWithDetails | null> {
    let query = supabase
      .from("users")
      .select(`
        *,
        role:roles(*),
        organization:organizations(*),
        client:clients(*),
        department:departments(*),
        branch:branches(*)
      `)
      .eq("email", email)
      .eq("isactive", true);

    // Filter by org and client if provided
    if (orgid) query = query.eq("orgid", orgid);
    if (clientid) query = query.eq("clientid", clientid);

    const { data, error } = await query.single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data as UserWithDetails;
  },

  /**
   * Get user by ID
   */
  async getUserById(userid: number): Promise<UserWithDetails | null> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        role:roles(*),
        organization:organizations(*),
        client:clients(*),
        department:departments(*),
        branch:branches(*)
      `)
      .eq("userid", userid)
      .eq("isactive", true)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data as UserWithDetails;
  },

  /**
   * Create a new user in the users table
   * This should be called after Supabase Auth signup
   */
  async createUser(userData: {
    email: string;
    fullname: string;
    orgid: number;
    clientid: number;
    roleid?: number;
    departmentid?: number;
    branchid?: number;
  }): Promise<User | null> {
    // Default role is "Employee" (roleid 3)
    const defaultRoleId = userData.roleid || 3;

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          fullname: userData.fullname,
          orgid: userData.orgid,
          clientid: userData.clientid,
          passwordhash: "HANDLED_BY_SUPABASE_AUTH",
          roleid: defaultRoleId,
          departmentid: userData.departmentid || null,
          branchid: userData.branchid || null,
          status: "Active",
          isactive: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data as User;
  },

  /**
   * Update user profile
   */
  async updateUser(
    userid: number,
    updates: Partial<User>
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updatedat: new Date().toISOString(),
      })
      .eq("userid", userid)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data as User;
  },

  /**
   * Get all active users
   */
  async getAllUsers(orgid?: number, clientid?: number): Promise<UserWithDetails[]> {
    let query = supabase
      .from("users")
      .select(`
        *,
        role:roles(*),
        organization:organizations(*),
        client:clients(*),
        department:departments(*),
        branch:branches(*)
      `)
      .eq("isactive", true)
      .order("fullname", { ascending: true });

    // Filter by org and client if provided
    if (orgid) query = query.eq("orgid", orgid);
    if (clientid) query = query.eq("clientid", clientid);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return data as UserWithDetails[];
  },

  /**
   * Deactivate user (soft delete)
   */
  async deactivateUser(userid: number): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({ isactive: false, updatedat: new Date().toISOString() })
      .eq("userid", userid);

    if (error) {
      console.error("Error deactivating user:", error);
      return false;
    }

    return true;
  },
};
