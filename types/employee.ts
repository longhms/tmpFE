/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [employee.ts], [Apr, 2026] [ntlong]
 */

/**
 * Type definitions cho toàn bộ module Employee:
 *   - List (ADM002), Detail (ADM003), Form add/edit (ADM004 / ADM005),
 *   - Payload gửi BE và Result trả về UI,
 *   - Các session key dùng để truyền state giữa các màn hình.
 *
 * @author [ntlong]
 */

// ──────────────────────────────────────────────
// List (ADM002)
// ──────────────────────────────────────────────

/** 1 dòng nhân viên trong bảng danh sách. */
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

/** Response GET /employee (danh sách). */
export interface EmployeeListApiResponse {
  code: number;
  totalRecords?: number;
  employees?: EmployeeListItem[];
  message?: {
    code?: string;
    params?: string[];
  };
}

// ──────────────────────────────────────────────
// Detail (ADM003)
// ──────────────────────────────────────────────

/** 1 dòng chứng chỉ trong response chi tiết nhân viên. */
export interface CertificationDetail {
  certificationId: number;
  certificationLevel: number | null;
  certificationName: string;
  startDate: string;
  endDate: string;
  score: number;
}

/** Chi tiết 1 nhân viên - khớp EmployeeDetailDTO của BE. */
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

/** Response GET /employee/{id}. */
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

// ──────────────────────────────────────────────
// Form add/edit (ADM004 / ADM005)
// ──────────────────────────────────────────────

/**
 * Dữ liệu form nhân viên - dùng làm generic type cho react-hook-form.
 * Tất cả trường đều là string để dễ kiểm soát với input/select.
 * Trường ngày tháng lưu chuỗi định dạng 'yyyy/MM/dd'.
 */
export interface EmployeeFormData {
  /** Tên đăng nhập */
  loginId: string;
  /** ID phòng ban (chọn từ dropdown) */
  departmentId: string;
  /** Tên nhân viên */
  employeeName: string;
  /** Tên nhân viên bằng Katakana */
  employeeNameKana: string;
  /** Ngày sinh, định dạng 'yyyy/MM/dd' */
  birthDate: string;
  /** Địa chỉ email */
  employeeEmail: string;
  /** Số điện thoại */
  employeeTelephone: string;
  /** Mật khẩu đăng nhập */
  loginPassword?: string;
  /** Xác nhận mật khẩu */
  loginPasswordConfirm?: string;
  /** ID chứng chỉ JP ('' nếu không có chứng chỉ) */
  certificationId: string;
  /** Ngày cấp chứng chỉ, định dạng 'yyyy/MM/dd' ('' nếu không có chứng chỉ) */
  certificationStartDate: string;
  /** Ngày hết hạn chứng chỉ, định dạng 'yyyy/MM/dd' ('' nếu không có chứng chỉ) */
  certificationEndDate: string;
  /** Điểm chứng chỉ ('' nếu không có chứng chỉ) */
  score: string;
}

/** Mode màn hình: thêm mới hoặc chỉnh sửa */
export type FormMode = 'add' | 'edit';

/** Payload gửi lên POST /employee - khớp EmployeeRequest của BE. */
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

// ──────────────────────────────────────────────
// Delete (ADM003 -> ADM006)
// ──────────────────────────────────────────────

/** Kết quả trả về cho UI sau khi gọi deleteEmployee. */
export interface DeleteEmployeeResult {
  ok: boolean;
  /** Mã lỗi nguyên gốc (ER020,…) để UI nhận biết và xử lý phân nhánh. */
  errorCode?: string;
  message: string;
}

// ──────────────────────────────────────────────
// Session keys (truyền state giữa các màn hình)
// ──────────────────────────────────────────────

/** Lưu bản dữ liệu form từ ADM004 -> ADM005. */
export const SESSION_KEY_EMPLOYEE_DATA = 'employeeDraft';

/** Lưu mode form ('add' | 'edit'). */
export const SESSION_KEY_MODE = 'employeeMode';

/** Lưu message hoàn thành (MSG001/002/003) cho /employees/complete. */
export const SESSION_KEY_COMPLETE_MESSAGE = 'completeMessage';

/** Lưu message lỗi system cho /employees/system-error. */
export const SESSION_KEY_ERROR_MESSAGE = 'systemErrorMessage';
