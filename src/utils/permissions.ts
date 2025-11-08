// Role-based permissions utility
// Role IDs: 1 = Admin, 2 = HR, 3 = Employee

export const ROLES = {
  ADMIN: 1,
  HR: 2,
  EMPLOYEE: 3,
} as const;

export type RoleId = typeof ROLES[keyof typeof ROLES];

export interface Permission {
  canViewDashboard: boolean;
  canViewEmployees: boolean;
  canCreateEmployee: boolean;
  canEditEmployee: boolean;
  canDeleteEmployee: boolean;
  canViewAttendance: boolean;
  canEditAttendance: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canManageRoles: boolean;
  canManageOrganization: boolean;
}

export const getPermissions = (roleid: number): Permission => {
  switch (roleid) {
    case ROLES.ADMIN:
      // Admin has full access to everything
      return {
        canViewDashboard: true,
        canViewEmployees: true,
        canCreateEmployee: true,
        canEditEmployee: true,
        canDeleteEmployee: true,
        canViewAttendance: true,
        canEditAttendance: true,
        canViewReports: true,
        canManageSettings: true,
        canManageRoles: true,
        canManageOrganization: true,
      };
    
    case ROLES.HR:
      // HR can create employees and edit attendance
      return {
        canViewDashboard: true,
        canViewEmployees: true,
        canCreateEmployee: true,
        canEditEmployee: true,
        canDeleteEmployee: false,
        canViewAttendance: true,
        canEditAttendance: true,
        canViewReports: true,
        canManageSettings: false,
        canManageRoles: false,
        canManageOrganization: false,
      };
    
    case ROLES.EMPLOYEE:
      // Employee has limited access
      return {
        canViewDashboard: true,
        canViewEmployees: true,
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewAttendance: true,
        canEditAttendance: false,
        canViewReports: false,
        canManageSettings: false,
        canManageRoles: false,
        canManageOrganization: false,
      };
    
    default:
      // Default to employee permissions
      return {
        canViewDashboard: true,
        canViewEmployees: true,
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewAttendance: true,
        canEditAttendance: false,
        canViewReports: false,
        canManageSettings: false,
        canManageRoles: false,
        canManageOrganization: false,
      };
  }
};

// Convenience functions
export const canCreateEmployee = (roleid: number): boolean => {
  return roleid === ROLES.ADMIN || roleid === ROLES.HR;
};

export const canEditAttendance = (roleid: number): boolean => {
  return roleid === ROLES.ADMIN || roleid === ROLES.HR;
};

export const isAdmin = (roleid: number): boolean => {
  return roleid === ROLES.ADMIN;
};

export const isHR = (roleid: number): boolean => {
  return roleid === ROLES.HR;
};

export const isEmployee = (roleid: number): boolean => {
  return roleid === ROLES.EMPLOYEE;
};
