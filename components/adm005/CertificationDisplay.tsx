/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [CertificationDisplay.tsx], [Apr, 2026] [ntlong]
 *
 * Component hiển thị section 日本語能力 trong ADM005 (readonly).
 * Gồm: tiêu đề section + 資格, 資格交付日, 失効日, 点数.
 *
 */

'use client';

import { EmployeeFormData } from '@/types/employee';

/** Props nhận từ EmployeeConfirmForm */
type Props = {
  /** Dữ liệu form đã validate từ ADM004 */
  employeeFormData: EmployeeFormData;
  /** Tên chứng chỉ tra cứu từ certificationId (hiển thị thay vì ID số) */
  certificationName: string;
};

/**
 * Hiển thị section 日本語能力 dạng readonly.
 * Trả về các <li> element bao gồm cả tiêu đề section.
 */
export default function CertificationDisplay({ employeeFormData, certificationName }: Props) {
  return (
    <>
      {/* Tiêu đề section 日本語能力 */}
      <li className="title mt-12">
        <a href="#!">日本語能力</a>
      </li>

      {/* 資格 (Tên chứng chỉ) — rỗng nếu không chọn */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">資格</label>
        <div className="col-sm col-sm-10">{certificationName}</div>
      </li>

      {/* 資格交付日 (Ngày cấp chứng chỉ) — rỗng nếu không chọn */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">資格交付日</label>
        <div className="col-sm col-sm-10">{employeeFormData.certificationStartDate}</div>
      </li>

      {/* 失効日 (Ngày hết hạn chứng chỉ) — rỗng nếu không chọn */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">失効日</label>
        <div className="col-sm col-sm-10">{employeeFormData.certificationEndDate}</div>
      </li>

      {/* 点数 (Điểm chứng chỉ) — rỗng nếu không chọn */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">点数</label>
        <div className="col-sm col-sm-10">{employeeFormData.score}</div>
      </li>
    </>
  );
}
