import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, TrendingUp, Clock, Calendar } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: "Total Employees", value: "0", change: "+0%", icon: Users, trend: "up" },
    { title: "Present Today", value: "0", change: "0%", icon: UserCheck, trend: "up" },
    { title: "Absent Today", value: "0", change: "0%", icon: UserX, trend: "down" },
    { title: "Avg. Attendance", value: "0%", change: "+0%", icon: TrendingUp, trend: "up" }
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.orgid || !user?.clientid) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Get total employees
        const { count: totalEmployees } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("orgid", user.orgid)
          .eq("clientid", user.clientid)
          .eq("isactive", true);

        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const { data: todayAttendance } = await supabase
          .from("attendance")
          .select("userid, checkintime, checkouttime")
          .eq("orgid", user.orgid)
          .eq("clientid", user.clientid)
          .eq("date", today);

        const presentToday = todayAttendance?.filter(a => a.checkintime).length || 0;
        const absentToday = (totalEmployees || 0) - presentToday;
        const attendancePercentage = totalEmployees ? ((presentToday / totalEmployees) * 100).toFixed(1) : "0";

        // Get recent activity (last 10 check-ins/check-outs)
        const { data: recentCheckins } = await supabase
          .from("attendance")
          .select(`
            userid,
            checkintime,
            checkouttime,
            createdat,
            user:users(fullname)
          `)
          .eq("orgid", user.orgid)
          .eq("clientid", user.clientid)
          .not("checkintime", "is", null)
          .order("createdat", { ascending: false })
          .limit(10);

        // Format recent activity
        const formattedActivity = recentCheckins?.map(record => {
          const checkinTime = new Date(record.checkintime);
          const now = new Date();
          const diffMs = now.getTime() - checkinTime.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          
          let timeAgo = "";
          if (diffMins < 1) timeAgo = "Just now";
          else if (diffMins < 60) timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
          else {
            const diffHours = Math.floor(diffMins / 60);
            timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          }

          return {
            name: record.user?.fullname || "Unknown",
            action: record.checkouttime ? "Checked out" : "Checked in",
            time: timeAgo,
            status: record.checkouttime ? "out" : "in"
          };
        }) || [];

        setStats([
          {
            title: "Total Employees",
            value: String(totalEmployees || 0),
            change: "+0%",
            icon: Users,
            trend: "up"
          },
          {
            title: "Present Today",
            value: String(presentToday),
            change: `${attendancePercentage}%`,
            icon: UserCheck,
            trend: "up"
          },
          {
            title: "Absent Today",
            value: String(absentToday),
            change: "-0%",
            icon: UserX,
            trend: "down"
          },
          {
            title: "Avg. Attendance",
            value: `${attendancePercentage}%`,
            change: "+0%",
            icon: TrendingUp,
            trend: "up"
          }
        ]);

        setRecentActivity(formattedActivity);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.orgid, user?.clientid]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-4 text-center py-8 text-muted-foreground">Loading dashboard...</div>
          ) : stats.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'} mt-1`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-muted-foreground py-4">Loading...</div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">No recent activity</div>
                ) : recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {activity.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'in' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {activity.status === 'in' ? 'In' : 'Out'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Employees
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
