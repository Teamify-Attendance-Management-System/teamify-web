import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import EmployeeCreateModal from "@/components/EmployeeCreateModal";
import { canCreateEmployee } from "@/utils/permissions";

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch employees (with joins)
  const fetchEmployees = async () => {
    if (!user?.orgid || !user?.clientid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from("users")
        .select(
          `userid, fullname, email, status, department:departments(departmentname), role:roles(rolename)`
        )
        .eq("orgid", user.orgid)
        .eq("clientid", user.clientid)
        .eq("isactive", true);

      if (search)
        query = query.ilike("fullname", `%${search}%`);

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      } else {
        setEmployees(data ?? []);
      }
    } catch (error) {
      console.error("Error:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [user?.orgid, user?.clientid, search, showModal]);

  // Check if user has permission to create employees (Admin or HR)
  const hasCreatePermission = user?.roleid ? canCreateEmployee(user.roleid) : false;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team members and their information
            </p>
          </div>
          {hasCreatePermission && (
            <Button className="shadow-soft" onClick={() => setShowModal(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <Card className="p-4 shadow-soft">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* You may enhance with status/department filter */}
          </div>
        </Card>

        {/* Employees Table */}
        <Card className="shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.userid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {employee.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-medium">{employee.fullname}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                    <TableCell>{employee.department?.departmentname || "-"}</TableCell>
                    <TableCell>{employee.role?.rolename || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      {showModal && user?.orgid && user?.clientid && (
        <EmployeeCreateModal onClose={() => setShowModal(false)} orgid={user.orgid} clientid={user.clientid} />
      )}
    </DashboardLayout>
  );
};

export default Employees;
