import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  BarChart3, 
  Settings, 
  LogOut,
  QrCode
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { user, supabaseUser, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getUserInitials = () => {
    if (user?.fullname) {
      const names = user.fullname.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.fullname.substring(0, 2).toUpperCase();
    }
    if (supabaseUser?.email) {
      return supabaseUser.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user?.fullname || supabaseUser?.email || "User";
  };

  const getUserRole = () => {
    return user?.role?.rolename || "Employee";
  };

  const getUserDepartment = () => {
    return user?.department?.departmentname || null;
  };

  const getUserOrganization = () => {
    return user?.organization?.orgname || null;
  };

  const getUserClient = () => {
    return user?.client?.clientname || null;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Attendance", href: "/attendance", icon: Clock },
    { name: "QR Codes", href: "/qr-codes", icon: QrCode },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-soft">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/teamify-logo.svg" alt="Teamify" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold">Teamify</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : ""
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getUserName()}</p>
                <p className="text-xs text-muted-foreground truncate">{getUserRole()}</p>
                {getUserDepartment() && (
                  <p className="text-xs text-muted-foreground truncate">{getUserDepartment()}</p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
