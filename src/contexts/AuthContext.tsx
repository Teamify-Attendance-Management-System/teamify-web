import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserWithDetails } from "@/types/database";
import { userService } from "@/services/userService";

interface AuthContextType {
  user: UserWithDetails | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user?.email) {
          try {
            // Fetch user details from custom users table with timeout
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            );
            
            const userData = await Promise.race([
              userService.getUserByEmail(session.user.email),
              timeoutPromise
            ]);
            
            setUser(userData as any);
          } catch (error) {
            console.error("Error fetching user data:", error);
            // If we can't fetch user data, still allow them to be logged in
            // but without full profile data
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setSupabaseUser(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user?.email) {
        try {
          // Fetch user details from custom users table with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          );
          
          const userData = await Promise.race([
            userService.getUserByEmail(session.user.email),
            timeoutPromise
          ]);
          
          setUser(userData as any);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      toast.success("Signed out successfully");
      
      // Redirect to auth page
      window.location.href = "/auth";
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  const value = {
    user,
    supabaseUser,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
