import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmployeeCreateModalProps {
  onClose: () => void;
  orgid: number;
  clientid: number;
}

const EmployeeCreateModal = ({ onClose, orgid, clientid }: EmployeeCreateModalProps) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'admin'|'hr'|'employee'>("employee");
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(password);
    toast.success("Password generated!");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Please generate or enter a password");
      return;
    }
    
    setLoading(true);

    try {
      // Call Edge Function to create user in both auth.users and users table
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to create users");
      }

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
            role,
            orgid,
            clientid,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      toast.success(
        `Employee created successfully! They can now sign in with email: ${email}`,
        { duration: 5000 }
      );
      onClose();
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast.error(error.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-card p-6 rounded-lg shadow-lg min-w-[400px] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4">Add Employee</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name *</Label>
            <Input
              id="fullname"
              required
              placeholder="John Doe"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              required
              placeholder="john@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                placeholder="Click Generate or enter manually"
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                disabled={loading}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              User will be created in both Auth and Database automatically
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2 space-y-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs text-green-800">
              <p className="font-semibold mb-1">✅ Automated User Creation</p>
              <p>This will create the employee in:</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>Supabase Authentication (for login)</li>
                <li>Users Database (for app data and permissions)</li>
                <li>Employee can immediately sign in with: <span className="font-mono bg-white px-1">{email || "email@example.com"}</span></li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreateModal;
