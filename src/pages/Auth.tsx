import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { supabaseUser } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (supabaseUser) {
      navigate("/dashboard");
    }
  }, [supabaseUser, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      // Redirect will happen via useEffect when supabaseUser updates
      // Don't set isLoading to false here, let the redirect happen
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <Card className="shadow-large border-border/50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/teamify-logo.svg" alt="Teamify" className="w-10 h-10 rounded-lg" />
              <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Teamify
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => toast.info("Please contact your administrator to reset your password")}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
