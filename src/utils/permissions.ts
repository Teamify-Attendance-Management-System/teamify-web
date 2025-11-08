// Role-based permissions utility (enum string roles)
import type { UserRole } from "@/types/database";

export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  EMPLOYEE: 'employee',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

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

export const getPermissions = (role: UserRole): Permission => {
  switch (role) {
    case ROLES.ADMIN:
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
    default:
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
export const canCreateEmployee = (role: UserRole): boolean => {
  return role === ROLES.ADMIN || role === ROLES.HR;
};

export const canEditAttendance = (role: UserRole): boolean => {
  return role === ROLES.ADMIN || role === ROLES.HR;
};

export const isAdmin = (role: UserRole): boolean => role === ROLES.ADMIN;
export const isHR = (role: UserRole): boolean => role === ROLES.HR;
export const isEmployee = (role: UserRole): boolean => role === ROLES.EMPLOYEE;
