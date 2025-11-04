import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, TrendingUp, Clock, Calendar } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "248",
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Present Today",
      value: "186",
      change: "75%",
      icon: UserCheck,
      trend: "up"
    },
    {
      title: "Absent Today",
      value: "62",
      change: "-5%",
      icon: UserX,
      trend: "down"
    },
    {
      title: "Avg. Attendance",
      value: "89.2%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentActivity = [
    { name: "Sarah Johnson", action: "Checked in", time: "2 minutes ago", status: "in" },
    { name: "Mike Chen", action: "Checked out", time: "15 minutes ago", status: "out" },
    { name: "Emily Davis", action: "Checked in", time: "32 minutes ago", status: "in" },
    { name: "James Wilson", action: "Checked in", time: "1 hour ago", status: "in" },
  ];

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
          {stats.map((stat, index) => (
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
                {recentActivity.map((activity, index) => (
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
