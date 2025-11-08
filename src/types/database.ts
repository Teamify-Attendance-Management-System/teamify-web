// Database Types based on PostgreSQL schema (updated to UUID users and enum role)

export interface Organization {
  orgid: number;
  orgname: string;
  address: string | null;
  contactemail: string | null;
  createdat: string;
  updatedat: string;
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
}

export interface Client {
  clientid: number;
  clientname: string;
  createdat: string;
  updatedat: string;
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
  // Relations
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
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
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
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
}

export type UserRole = 'admin' | 'hr' | 'employee';

export interface User {
  userid: string; // uuid (auth.users.id)
  orgid: number | null;
  clientid: number | null;
  fullname: string;
  email: string;
  role: UserRole; // enum in DB
  departmentid: number | null;
  branchid: number | null;
  managerid: string | null; // uuid
  status: string;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
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
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
}

export interface Attendance {
  attendanceid: number;
  orgid: number;
  clientid: number;
  userid: string; // uuid
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
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
}

export interface AttendanceRequest {
  requestid: number;
  orgid: number;
  clientid: number;
  attendanceid: number | null;
  userid: string | null; // uuid
  requesttype: string | null;
  reason: string | null;
  status: string | null;
  approvedby: string | null; // uuid
  isactive: boolean;
  createdat: string;
  updatedat: string;
  createdby: string | null; // uuid
  updatedby: string | null; // uuid
}

export interface AuditLog {
  logid: number;
  orgid: number;
  clientid: number;
  userid: string | null; // uuid
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
  // relations used in queries elsewhere
  organization?: Organization | null;
  client?: Client | null;
  department?: Department | null;
  branch?: Branch | null;
}
