/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [employeeService.ts], [Apr, 2026] [ntlong]
 */

import { apiClient } from '@/lib/api/client';
import {
  CreateEmployeePayload,
  CreateEmployeeResult,
  DeleteEmployeeResult,
  EmployeeDetailApiResponse,
  EmployeeFormData,
  EmployeeListApiResponse,
  GetEmployeeDetailResult,
} from '@/types/employee';
import { SortField, SortOrder } from '@/lib/constants/employee';
import { formatMessage } from '@/lib/constants/messages';

/**
 * Service gọi API liên quan đến chức năng Employee.
 * Build query params, format payload, parse response và format message lỗi.
 *
 * @author [ntlong]
 */

/**
 * Tham số truyền vào API lấy danh sách nhân viên.
 * Tương ứng query params của GET /employee.
 */
export interface FetchEmployeeListParams {
  /** Tìm kiếm theo tên (LIKE %name%) */
  employeeName: string;
  /** Lọc theo phòng ban (exact match) */
  departmentId: string;
  /** Thứ tự sắp xếp của 3 trường */
  sortDirections: Record<SortField, SortOrder>;
  /** Vị trí bắt đầu lấy dữ liệu */
  offset: number;
  /** Số bản ghi tối đa mỗi trang */
  limit: number;
}

/**
 * Gọi API GET /employee để lấy danh sách nhân viên.
 * Thứ tự ưu tiên sort cố định: employeeName -> certificationName -> endDate.
 *
 * @param params Các tham số tìm kiếm, sắp xếp, phân trang
 * @returns Promise<EmployeeListApiResponse> kết quả trả về từ API
 */
export const fetchEmployeeList = async (
  params: FetchEmployeeListParams
): Promise<EmployeeListApiResponse> => {
  const searchParams = new URLSearchParams();

  // Luôn truyền đủ tất cả params theo đúng format API yêu cầu.
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
 * Gọi GET /employee/check-employee-login-id để check trùng loginId.
 *
 * @param loginId loginId muốn check
 * @returns true nếu đã tồn tại (trùng)
 */
export const checkLoginIdDuplicate = async (loginId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/check-employee-login-id?loginId=${loginId}`);
  return res.data.code !== 200;
};

/**
 * Check department có tồn tại không.
 *
 * @param departmentId ID phòng ban
 * @returns true nếu KHÔNG tồn tại (lỗi ER004)
 */
export const checkDepartmentNotExists = async (departmentId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/check-refs-exist?departmentId=${departmentId}`);
  return res.data.code !== 200;
};

/**
 * Check certification có tồn tại không.
 *
 * @param certificationId ID chứng chỉ
 * @returns true nếu KHÔNG tồn tại (lỗi ER004)
 */
export const checkCertificationNotExists = async (certificationId: string): Promise<boolean> => {
  const res = await apiClient.get(`/employee/check-refs-exist?certificationId=${certificationId}`);
  return res.data.code !== 200;
};

/**
 * Convert EmployeeFormData (dữ liệu form) sang CreateEmployeePayload (payload BE).
 *
 * @param data Dữ liệu form đã validate
 * @returns Payload sẵn sàng gửi POST /employee
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
 * Nếu BE trả 400/500 kèm message thì format ra tiếng Nhật.
 *
 * @param data Dữ liệu form đã validate
 * @returns Promise<CreateEmployeeResult> kết quả cho UI
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
 * Gọi DELETE /employee/{id} để xóa nhân viên (ADM003).
 *
 * Trường hợp lỗi:
 *   - ER014 (không tồn tại khi xóa) -> 400, hiển thị ở /employees/system-error.
 *   - ER020 (xóa admin)             -> 400, hiển thị inline trên ADM003.
 *   - ER015 / 500                   -> redirect /employees/system-error.
 *
 * @param employeeId ID nhân viên cần xóa
 * @returns Promise<DeleteEmployeeResult> { ok, message, errorCode? }
 */
export const deleteEmployee = async (
  employeeId: number
): Promise<DeleteEmployeeResult> => {
  try {
    const res = await apiClient.delete(`/employee/${employeeId}`);
    return { ok: res.data.code === 200, message: '' };
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { data?: { message?: { code?: string; params?: string[] } } };
    };
    const data = axiosErr.response?.data;
    if (data?.message?.code) {
      return {
        ok: false,
        message: formatMessage(data.message.code, data.message.params),
        errorCode: data.message.code,
      };
    }
    return { ok: false, message: formatMessage('ER015'), errorCode: 'ER015' };
  }
};

/**
 * Gọi GET /employee/{id} để lấy chi tiết 1 nhân viên (ADM003).
 *
 * Trường hợp lỗi:
 *   - ER013 (không tồn tại) -> axios catch 400, format message hiển thị.
 *   - ER015 / 500           -> format message hệ thống.
 *
 * @param employeeId ID nhân viên
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

/**
 * gọi API với phương thức put để cập nhật nhân viên.
 * 
 * @param employeeId id nhân viên
 * @param data thông tin nhân viên
 * @returns { ok, message, employeeId }
 */
export const updateEmployee = async (
  employeeId:number, 
  data: EmployeeFormData
  ): Promise<CreateEmployeeResult> => {
  const payload = toCreateEmployeePayload(data);
  const res = await apiClient.put(`/employee/${employeeId}`, payload);
  const { code, message } = res.data;

  return {
    ok: code === 200,
    message: message ? formatMessage(message.code, message.params) : '',
    employeeId,
  };
};
