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

/** Payload gửi lên POST /employee — khớp EmployeeRequest của BE. */
export interface CreateEmployeePayload {
  employeeLoginId: string;
  employeeLoginPassword: string;
  departmentId: number;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  certifications: {
    certificationId: number;
    startDate: string;
    endDate: string;
    score: string;
  }[];
}

/** Kết quả trả về cho UI sau khi gọi createEmployee. */
export interface CreateEmployeeResult {
  ok: boolean;
  message: string;
  employeeId?: number;
}