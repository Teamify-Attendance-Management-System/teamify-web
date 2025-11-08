import { supabase } from "@/integrations/supabase/client";
import { User, UserWithDetails, UserRole } from "@/types/database";

export const userService = {
  /**
   * Get user by email (fallback). Prefer getUserById(auth.uid()).
   */
  async getUserByEmail(email: string, orgid?: number, clientid?: number): Promise<UserWithDetails | null> {
    let query = supabase
      .from("users")
      .select(`
        *,
        organization:organizations(*),
        client:clients(*),
        department:departments(*),
        branch:branches(*)
      `)
      .eq("email", email)
      .eq("isactive", true);

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
   * Get user by UUID
   */
  async getUserById(userid: string): Promise<UserWithDetails | null> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
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
   * Create/upsert a user row (should be done by Edge Function normally)
   */
  async createUser(userData: {
    userid: string; // auth.users.id
    email: string;
    fullname: string;
    orgid: number;
    clientid: number;
    role?: UserRole;
    departmentid?: number;
    branchid?: number;
  }): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .upsert([
        {
          userid: userData.userid,
          email: userData.email,
          fullname: userData.fullname,
          orgid: userData.orgid,
          clientid: userData.clientid,
          role: userData.role || 'employee',
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
    userid: string,
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
        organization:organizations(*),
        client:clients(*),
        department:departments(*),
        branch:branches(*)
      `)
      .eq("isactive", true)
      .order("fullname", { ascending: true });

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
  async deactivateUser(userid: string): Promise<boolean> {
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
