import { supabase } from "@/integrations/supabase/client";
import { Organization, Client } from "@/types/database";

export const orgClientService = {
  /**
   * Get all active clients
   */
  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        organization:organizations(*)
      `)
      .order("clientname", { ascending: true });

    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }

    return data as Client[];
  },

  /**
   * Get all active organizations for a client
   */
  async getOrganizationsByClient(clientid: number): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("orgid", clientid)
      .order("orgname", { ascending: true });

    if (error) {
      console.error("Error fetching organizations:", error);
      return [];
    }

    return data as Organization[];
  },

  /**
   * Get organization by ID
   */
  async getOrganizationById(orgid: number): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("orgid", orgid)
      .single();

    if (error) {
      console.error("Error fetching organization:", error);
      return null;
    }

    return data as Organization;
  },

  /**
   * Get client by ID
   */
  async getClientById(clientid: number): Promise<Client | null> {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq("clientid", clientid)
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      return null;
    }

    return data as Client;
  },
};
