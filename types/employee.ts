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

/** 1 dòng chứng chỉ trong response chi tiết nhân viên (ADM003). */
export interface CertificationDetail {
  certificationId: number;
  certificationLevel: number | null;
  certificationName: string;
  startDate: string;
  endDate: string;
  score: number;
}

/** Chi tiết 1 nhân viên — khớp EmployeeDetailDTO của BE. */
export interface EmployeeDetail {
  employeeId: number;
  employeeLoginId: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  departmentId: number | null;
  departmentName: string | null;
  certifications: CertificationDetail[];
}

/** Response GET /employee/{id} — thành công code=200. */
export interface EmployeeDetailApiResponse {
  code: number;
  employee?: EmployeeDetail;
  message?: {
    code?: string;
    params?: string[];
  };
}

/** Kết quả trả về cho UI sau khi gọi getEmployeeDetail. */
export interface GetEmployeeDetailResult {
  ok: boolean;
  employee?: EmployeeDetail;
  message: string;
}