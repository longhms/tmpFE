/**
 * Type definitions cho Employee.
 */

export interface EmployeeListItem {
  employeeId: number;
  employeeName: string;
  employeeBirthDate: string | null;
  departmentName: string | null;
  employeeEmail: string | null;
  employeeTelephone: string | null;
  certificationName: string | null;
  endDate: string | null;
  score: number | null;
}

export interface EmployeeListApiResponse {
  code: number;
  totalRecords?: number;
  employees?: EmployeeListItem[];
  message?: {
    code?: string;
    params?: string[];
  };
}

