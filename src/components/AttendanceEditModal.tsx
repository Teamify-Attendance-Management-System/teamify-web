import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttendanceEditModalProps {
  attendanceRecord: {
    attendanceid: number;
    date: string;
    checkintime: string | null;
    checkouttime: string | null;
    status: string | null;
    remarks: string | null;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const AttendanceEditModal = ({ attendanceRecord, onClose, onSuccess }: AttendanceEditModalProps) => {
  const [checkintime, setCheckintime] = useState(
    attendanceRecord.checkintime ? new Date(attendanceRecord.checkintime).toISOString().slice(0, 16) : ""
  );
  const [checkouttime, setCheckouttime] = useState(
    attendanceRecord.checkouttime ? new Date(attendanceRecord.checkouttime).toISOString().slice(0, 16) : ""
  );
  const [status, setStatus] = useState(attendanceRecord.status || "Present");
  const [remarks, setRemarks] = useState(attendanceRecord.remarks || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("attendance")
        .update({
          checkintime: checkintime ? new Date(checkintime).toISOString() : null,
          checkouttime: checkouttime ? new Date(checkouttime).toISOString() : null,
          status,
          remarks,
        })
        .eq("attendanceid", attendanceRecord.attendanceid);

      if (error) throw error;

      toast.success("Attendance updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating attendance:", error);
      toast.error(error.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogDescription>
            Update attendance record for {new Date(attendanceRecord.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleUpdate}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checkintime">Check-in Time</Label>
              <Input
                id="checkintime"
                type="datetime-local"
                value={checkintime}
                onChange={(e) => setCheckintime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkouttime">Check-out Time</Label>
              <Input
                id="checkouttime"
                type="datetime-local"
                value={checkouttime}
                onChange={(e) => setCheckouttime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceEditModal;
