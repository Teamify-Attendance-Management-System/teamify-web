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
  const [roleid, setRoleid] = useState("3");
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
    setLoading(true);

    try {
      // Step 1: Create auth user (requires admin to manually create in Supabase Auth first)
      // For now, we only create in users table
      // TODO: Implement Supabase Edge Function with Service Role to create auth users
      
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            fullname,
            email,
            passwordhash: "MANAGED_BY_ADMIN",
            orgid,
            clientid,
            roleid: parseInt(roleid),
            status: "Active",
            isactive: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success(
        `Employee created! Manual step: Create auth user in Supabase Dashboard with email: ${email}`,
        { duration: 10000 }
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
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                placeholder="Auto-generated or manual"
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
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
              Note: Auth user must be created manually in Supabase Dashboard
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={roleid} onValueChange={setRoleid} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">HR</SelectItem>
                <SelectItem value="3">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2 space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
              <p className="font-semibold mb-1">⚠️ Manual Auth Setup Required</p>
              <p>After creating this employee, you must:</p>
              <ol className="list-decimal ml-4 mt-1 space-y-1">
                <li>Go to Supabase Dashboard → Authentication → Users</li>
                <li>Click "Add User" and use the same email</li>
                <li>Set the password: <span className="font-mono bg-white px-1">{password || "(generate one)"}</span></li>
              </ol>
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
