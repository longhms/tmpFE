/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [certification.ts], [Apr, 2026] [ntlong]
 */

/**
 * Type definitions cho Certification (chứng chỉ tiếng Nhật):
 *   - Certification: 1 chứng chỉ dùng cho dropdown 資格 ở ADM004.
 *   - CertificationListApiResponse: shape response của GET /certifications.
 *
 * @author [ntlong]
 */

/** 1 chứng chỉ tiếng Nhật — dùng cho dropdown 資格. */
export interface Certification {
  /** ID chứng chỉ (PK ở DB) */
  certificationId: number;
  /** Tên chứng chỉ hiển thị cho user (vd "N1", "N2") */
  certificationName: string;
  /** Cấp độ chứng chỉ — dùng để sắp xếp (cấp cao đứng trước) */
  certificationLevel: number;
}

/** Response của GET /certifications — trả danh sách chứng chỉ cho dropdown. */
export interface CertificationListApiResponse {
  /** Mã HTTP status (200 / 500) */
  code: number;
  /** Danh sách chứng chỉ (chỉ có khi code = 200) */
  certifications?: Certification[];
  /** Thông tin lỗi (chỉ có khi thất bại) */
  message?: {
    code?: string;
    params?: string[];
  };
}