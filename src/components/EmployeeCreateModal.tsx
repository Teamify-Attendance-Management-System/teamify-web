import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";


const EmployeeCreateModal = ({ onClose, orgid, clientid }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Basic user creation - add more fields as needed!
    const { error } = await supabase
      .from("users")
      .insert([
        {
          fullname,
          email,
          orgid,
          clientid,
          status: "Active",
        },
      ]);
    setLoading(false);
    if (!error) {
      onClose();
    } else {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-card p-6 rounded-lg shadow-lg min-w-[320px] w-full max-w-sm">
        <h2 className="font-semibold text-lg mb-4">Add Employee</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            required
            placeholder="Full name"
            value={fullname}
            onChange={e => setFullname(e.target.value)}
            disabled={loading}
          />
          <Input
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          {errorMsg && (
            <div className="text-red-500 text-sm">{errorMsg}</div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreateModal;
