/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [department.ts], [Apr, 2026] [ntlong]
 */

/**
 * Type definitions cho Department:
 *   - Department: 1 phòng ban dùng cho dropdown グループ ở ADM004 và filter ở ADM002.
 *   - DepartmentListApiResponse: shape response của GET /departments.
 *
 * @author [ntlong]
 */

/** 1 phòng ban — dùng cho dropdown グループ. */
export interface Department {
  /** ID phòng ban (PK ở DB) */
  departmentId: number;
  /** Tên phòng ban hiển thị cho user */
  departmentName: string;
}

/** Response của GET /departments — trả danh sách phòng ban cho dropdown. */
export interface DepartmentListApiResponse {
  /** Mã HTTP status (200 / 500) */
  code: number;
  /** Danh sách phòng ban (chỉ có khi code = 200) */
  departments?: Department[];
  /** Thông tin lỗi (chỉ có khi thất bại) */
  message?: {
    code?: string;
    params?: string[];
  };
}