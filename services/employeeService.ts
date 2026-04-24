/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [employeeService.ts], [Apr, 2026] [ntlong]
 *
 * Service goi API lien quan den chuc nang Employee.
 * Xu ly viec build query params va goi API GET /employee.
 */

import { apiClient } from '@/lib/api/client';
import { EmployeeListApiResponse } from '@/types/employee';
import { SortField, SortOrder } from '@/lib/constants/employee';
import { formatMessage } from '@/lib/constants/messages';
import { EmployeeFormData } from '@/types/adm004';
import {
  CreateEmployeePayload,
  CreateEmployeeResult,
  EmployeeDetailApiResponse,
  GetEmployeeDetailResult,
} from '@/types/employee';



/**
 * Interface dinh nghia cac tham so truyen vao API lay danh sach nhan vien.
 * Tuong ung voi cac query params cua API: GET /employee
 */
export interface FetchEmployeeListParams {
  employeeName: string;    // Tim kiem theo ten (LIKE %name%)
  departmentId: string;    // Loc theo phong ban (exact match)
  sortDirections: Record<SortField, SortOrder>;  // Thu tu sap xep cua 3 truong
  offset: number;          // Vi tri bat dau lay du lieu
  limit: number;           // So ban ghi toi da moi trang
}

/**
 * Goi API GET /employee de lay danh sach nhan vien.
 *
 * URL default: /employee?employee_name=&department_id=
 *          &ord_employee_name=ASC&ord_certification_name=ASC
 *          &ord_end_date=DESC&offset=0&limit=20
 *
 * Thu tu uu tien sort co dinh: employeeName -> certificationName -> endDate
 *
 * @param params Cac tham so tim kiem, sap xep, phan trang
 * @returns Promise<EmployeeListApiResponse> Ket qua tra ve tu API
 */
export const fetchEmployeeList = async (
  params: FetchEmployeeListParams
): Promise<EmployeeListApiResponse> => {
  // Build query params tu object params
  const searchParams = new URLSearchParams();

  // Luon truyen du tat ca params theo dung format API yeu cau
  searchParams.set('employee_name', params.employeeName.trim());
  searchParams.set('department_id', params.departmentId);
  searchParams.set('ord_employee_name', params.sortDirections.employeeName);
  searchParams.set('ord_certification_name', params.sortDirections.certificationName);
  searchParams.set('ord_end_date', params.sortDirections.endDate);
  searchParams.set('offset', String(params.offset));
  searchParams.set('limit', String(params.limit));

  const response = await apiClient.get<EmployeeListApiResponse>(
    `/employee?${searchParams.toString()}`
  );

  return response.data;
};


/**
 * Get API check trùng loginId
 * 
 * @param loginId loginId muốn check trùng
 * @returns true = đã trùng loginId
 */
export const checkLoginIdDuplicate = async (loginId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/check-employee-login-id?loginId=${loginId}`);
  return res.data.code !== 200;
}

/**
 * Check department có tồn tại không.
 * @returns true = KHÔNG tồn tại (có lỗi ER004)
 */
export const checkDepartmentNotExists = async (departmentId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/validate-refs?departmentId=${departmentId}`);
  return res.data.code !== 200;
};

/**
 * Check certification có tồn tại không.
 * @returns true = KHÔNG tồn tại (có lỗi ER004)
 */
export const checkCertificationNotExists = async (certificationId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/validate-refs?certificationId=${certificationId}`);
  return res.data.code !== 200;
};

/**
 * Convert EmployeeFormData sang CreateEmployeePayload.
 */
export function toCreateEmployeePayload(
  data: EmployeeFormData
): CreateEmployeePayload {
  const certifications = data.certificationId
    ? [
      {
        certificationId: Number(data.certificationId),
        startDate: data.certificationStartDate,
        endDate: data.certificationEndDate,
        score: data.score,
      },
    ]
    : [];

  return {
    employeeLoginId: data.loginId,
    employeeLoginPassword: data.loginPassword,
    departmentId: Number(data.departmentId),
    employeeName: data.employeeName,
    employeeNameKana: data.employeeNameKana,
    employeeBirthDate: data.birthDate,
    employeeEmail: data.employeeEmail,
    employeeTelephone: data.employeeTelephone,
    certifications,
  };
}

/**
 * Gọi POST /employee để thêm mới nhân viên.
 * Trả về object { ok, message } để UI xử lý.
 * Nếu BE trả 400/500 kèm message → format ra tiếng Nhật.
 */
export const createEmployee = async (
  data: EmployeeFormData
): Promise<CreateEmployeeResult> => {
  const payload = toCreateEmployeePayload(data);
  const res = await apiClient.post('/employee', payload);

  const { code, employeeId, message } = res.data;
  const formatted = message
    ? formatMessage(message.code, message.params)
    : '';

  return {
    ok: code === 200,
    message: formatted,
    employeeId,
  };
};

/**
 * Goi GET /employee/{id} de lay chi tiet 1 nhan vien (ADM003).
 *
 * Truong hop loi:
 *   - ER013 (khong ton tai) -> axios catch 400, format message hien thi.
 *   - ER015 / 500           -> format message he thong.
 *
 * @param employeeId ID nhan vien
 * @returns Promise<GetEmployeeDetailResult> { ok, employee?, message }
 */
export const getEmployeeDetail = async (
  employeeId: number
): Promise<GetEmployeeDetailResult> => {
  try {
    const res = await apiClient.get<EmployeeDetailApiResponse>(
      `/employee/${employeeId}`
    );
    const { code, employee, message } = res.data;
    if (code === 200 && employee) {
      return { ok: true, employee, message: '' };
    }
    const formatted = message
      ? formatMessage(message.code ?? 'ER015', message.params)
      : formatMessage('ER015');
    return { ok: false, message: formatted };
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { data?: EmployeeDetailApiResponse };
    };
    const data = axiosErr.response?.data;
    if (data?.message?.code) {
      return {
        ok: false,
        message: formatMessage(data.message.code, data.message.params),
      };
    }
    return { ok: false, message: formatMessage('ER015') };
  }
};