import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, UserCheck, LogIn, LogOut as LogOutIcon, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { canEditAttendance } from "@/utils/permissions";
import AttendanceEditModal from "@/components/AttendanceEditModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceRecord {
  attendanceid: number;
  date: string;
  checkintime: string | null;
  checkouttime: string | null;
  status: string | null;
  remarks: string | null;
}

const Attendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  
  // Check if user has permission to edit attendance (Admin or HR)
  const hasEditPermission = user?.role ? canEditAttendance(user.role) : false;

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    if (!user?.userid || !user?.orgid || !user?.clientid) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("userid", user.userid)
      .eq("orgid", user.orgid)
      .eq("clientid", user.clientid)
      .eq("date", today)
      .maybeSingle();

    if (error) {
      console.error("Error fetching today's attendance:", error);
    } else {
      setTodayAttendance(data);
    }
  };

  // Fetch attendance history for selected month
  const fetchAttendanceHistory = async () => {
    if (!user?.userid || !user?.orgid || !user?.clientid) return;

    setLoading(true);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("userid", user.userid)
      .eq("orgid", user.orgid)
      .eq("clientid", user.clientid)
      .gte("date", startOfMonth)
      .lte("date", endOfMonth)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching attendance history:", error);
      setAttendanceHistory([]);
    } else {
      setAttendanceHistory(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayAttendance();
    fetchAttendanceHistory();
  }, [user?.userid, date]);

  // Check In
  const handleCheckIn = async () => {
    if (!user?.userid || !user?.orgid || !user?.clientid) {
      toast.error("User information not available");
      return;
    }

    setCheckingIn(true);
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    try {
      // Get location if available
      let locationLat = null;
      let locationLong = null;
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          locationLat = position.coords.latitude;
          locationLong = position.coords.longitude;
        } catch (error) {
          console.log("Location not available:", error);
        }
      }

      const { data, error } = await supabase
        .from("attendance")
        .insert([{
          userid: user.userid,
          orgid: user.orgid,
          clientid: user.clientid,
          date: today,
          checkintime: now,
          locationlat: locationLat,
          locationlong: locationLong,
          type: "Regular",
          method: "Web",
          status: "Present",
          isactive: true
        }])
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data);
      toast.success("Checked in successfully!");
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error(error.message || "Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    if (!todayAttendance) return;

    setCheckingOut(true);
    const now = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({ checkouttime: now })
        .eq("attendanceid", todayAttendance.attendanceid)
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data);
      toast.success("Checked out successfully!");
      fetchAttendanceHistory(); // Refresh history
    } catch (error: any) {
      console.error("Check-out error:", error);
      toast.error(error.message || "Failed to check out");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (checkin: string | null, checkout: string | null) => {
    if (!checkin) return "-";
    if (!checkout) return "In Progress";
    
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Mark your attendance and view your attendance history
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Attendance Card */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Attendance
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAttendance ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Check-in Time</p>
                      <p className="text-2xl font-bold">{formatTime(todayAttendance.checkintime)}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-success" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out Time</p>
                      <p className="text-2xl font-bold">{formatTime(todayAttendance.checkouttime)}</p>
                    </div>
                    <LogOutIcon className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="text-xl font-semibold">
                        {calculateDuration(todayAttendance.checkintime, todayAttendance.checkouttime)}
                      </p>
                    </div>
                  </div>

                  {!todayAttendance.checkouttime && (
                    <Button 
                      className="w-full" 
                      onClick={handleCheckOut}
                      disabled={checkingOut}
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      {checkingOut ? "Checking out..." : "Check Out"}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't checked in today</p>
                  <Button 
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    size="lg"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    {checkingIn ? "Checking in..." : "Check In Now"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a month to view attendance</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  {hasEditPermission && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : attendanceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No attendance records for this month
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceHistory.map((record) => (
                    <TableRow key={record.attendanceid}>
                      <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                      <TableCell>{formatTime(record.checkintime)}</TableCell>
                      <TableCell>{formatTime(record.checkouttime)}</TableCell>
                      <TableCell>
                        {calculateDuration(record.checkintime, record.checkouttime)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status === "Present" ? "default" : "secondary"}
                        >
                          {record.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      {hasEditPermission && (
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Modal */}
      {editingRecord && hasEditPermission && (
        <AttendanceEditModal
          attendanceRecord={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSuccess={() => {
            fetchTodayAttendance();
            fetchAttendanceHistory();
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Attendance;
