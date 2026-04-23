/**
 * Type definitions cho màn hình Thêm nhân viên.
 */

/**
 * Dữ liệu form nhân viên — dùng làm generic type cho react-hook-form.
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
  loginPassword: string;
  /** Xác nhận mật khẩu */
  loginPasswordConfirm: string;
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

/** Key lưu bản dữ liệu form trong sessionStorage (ADM004 → ADM005) */
export const SESSION_KEY_EMPLOYEE_DATA = 'employeeDraft';

/** Key lưu mode của form trong sessionStorage ('add' | 'edit') */
export const SESSION_KEY_MODE = 'employeeMode';

/** Key lưu ID nhân viên đang xem/sửa trong sessionStorage (ADM002 → ADM003 → ADM004) */
export const SESSION_KEY_EMPLOYEE_ID = 'employeeId';

/** Key lưu message hoàn thành (MSG001/002/003) để màn hình complete đọc hiển thị */
export const SESSION_KEY_COMPLETE_MESSAGE = 'completeMessage';

/** Key lưu message lỗi system để màn /system-error đọc hiển thị */
export const SESSION_KEY_ERROR_MESSAGE = 'systemErrorMessage';
