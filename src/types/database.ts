// Database Types based on PostgreSQL schema

export interface Role {
  roleid: number;
  rolename: string;
  description: string | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
}

export interface Organization {
  orgid: number;
  orgname: string;
  address: string | null;
  contactemail: string | null;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
}

export interface Client {
  clientid: number;
  clientname: string;
  orgid: number;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
}

export interface Department {
  departmentid: number;
  orgid: number;
  clientid: number;
  departmentname: string;
  description: string | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
  client?: Client;
}

export interface Branch {
  branchid: number;
  orgid: number;
  clientid: number;
  branchname: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  networkiprange: string | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
  client?: Client;
}

export interface User {
  userid: number;
  orgid: number;
  clientid: number;
  fullname: string;
  email: string;
  passwordhash: string;
  roleid: number;
  departmentid: number | null;
  branchid: number | null;
  managerid: number | null;
  status: string;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  role?: Role;
  organization?: Organization;
  client?: Client;
  department?: Department;
  branch?: Branch;
  manager?: User;
}

export interface Shift {
  shiftid: number;
  orgid: number;
  clientid: number;
  shiftname: string;
  starttime: string;
  endtime: string;
  description: string | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
  client?: Client;
}

export interface Attendance {
  attendanceid: number;
  orgid: number;
  clientid: number;
  userid: number;
  date: string;
  checkintime: string | null;
  checkouttime: string | null;
  locationlat: number | null;
  locationlong: number | null;
  type: string | null;
  method: string | null;
  status: string | null;
  shiftid: number | null;
  remarks: string | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
  client?: Client;
  user?: User;
  shift?: Shift;
}

export interface AttendanceRequest {
  requestid: number;
  orgid: number;
  clientid: number;
  attendanceid: number | null;
  userid: number | null;
  requesttype: string | null;
  reason: string | null;
  status: string | null;
  approvedby: number | null;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: number | null;
  updatedby: number | null;
  // Relations
  organization?: Organization;
  client?: Client;
  attendance?: Attendance;
  user?: User;
  approver?: User;
}

export interface RolePermission {
  id: number;
  roleid: number | null;
  permissionkey: string;
  isactive: boolean;
  createdat: string;
}

export interface AuditLog {
  logid: number;
  orgid: number;
  clientid: number;
  userid: number | null;
  actiontype: string | null;
  tablename: string | null;
  recordid: number | null;
  oldvalue: any;
  newvalue: any;
  timestamp: string;
  remarks: string | null;
}

// Type for user with full details (including relations)
export interface UserWithDetails extends User {
  role: Role;
  organization: Organization;
  client: Client;
  department: Department | null;
  branch: Branch | null;
}
