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

const Employees = () => {
  const employees = [
    { id: 1, name: "Sarah Johnson", email: "sarah@company.com", department: "Engineering", role: "Developer", status: "active" },
    { id: 2, name: "Mike Chen", email: "mike@company.com", department: "Design", role: "Designer", status: "active" },
    { id: 3, name: "Emily Davis", email: "emily@company.com", department: "Marketing", role: "Manager", status: "active" },
    { id: 4, name: "James Wilson", email: "james@company.com", department: "Sales", role: "Sales Rep", status: "active" },
    { id: 5, name: "Lisa Anderson", email: "lisa@company.com", department: "HR", role: "HR Manager", status: "inactive" },
  ];

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
          <Button className="shadow-soft">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 shadow-soft">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
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
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
