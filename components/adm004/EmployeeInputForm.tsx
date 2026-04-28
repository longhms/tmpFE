/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeInputForm.tsx], [Apr, 2026] [ntlong]
 *
 * Component form chính của màn hình Thêm/Sửa nhân viên (ADM004).
 * Đóng vai trò assembler: bọc thẻ <form>, ghép 2 section con và button group.
 *
 */

'use client';

import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { EmployeeFormData } from '@/types/employee';
import { Department } from '@/types/department';
import { Certification } from '@/types/certification';
import EmployeeInfoFields from './EmployeeInfoFields';
import CertificationFields from './CertificationFields';
import React from 'react';

/** Props nhận từ edit/page.tsx */
type Props = {
  /** register của react-hook-form */
  register: UseFormRegister<EmployeeFormData>;
  /** control của react-hook-form (dùng cho DatePicker) */
  control: Control<EmployeeFormData>;
  /** Danh sách lỗi field từ react-hook-form */
  errors: FieldErrors<EmployeeFormData>;
  /** Danh sách phòng ban cho dropdown グループ */
  departments: Department[];
  /** Lỗi khi gọi API lấy danh sách phòng ban ('' nếu không lỗi) */
  departmentError: string;
  /** Danh sách chứng chỉ cho dropdown 資格 */
  certifications: Certification[];
  /** Lỗi khi gọi API lấy danh sách chứng chỉ ('' nếu không lỗi) */
  certificationError: string;
  /**
   * true khi certificationId ≠ ''.
   * Truyền xuống CertificationFields để enable/disable 3 field phụ.
   */
  isCertSelected: boolean;
  /** Handler onChange của dropdown 資格 — xóa 3 field phụ khi bỏ chọn */
  onCertificationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Handler submit form (từ handleSubmit của react-hook-form trong useADM004) */
  onConfirm: React.FormEventHandler<HTMLFormElement>;
  /** Handler nút 戻る */
  onBack: () => void;
};

/**
 * Form tổng hợp màn hình ADM004.
 * Page.tsx giữ mỏng: chỉ gọi hook và truyền props vào component này.
 */
export default function EmployeeInputForm({
  register,
  control,
  errors,
  departments,
  departmentError,
  certifications,
  certificationError,
  isCertSelected,
  onCertificationChange,
  onConfirm,
  onBack,
}: Props) {
  const apiError = departmentError || certificationError;

  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={onConfirm}>
        <ul>
          {/* Tiêu đề màn hình */}
          <li className="title">会員情報編集</li>

          {/* Box lỗi chung: hiển thị lỗi gọi API dropdown (phòng ban / chứng chỉ) */}
          {apiError && (
            <li className="box-err">
              <div className="box-err-content">{apiError}</div>
            </li>
          )}

          {/* Section thông tin cá nhân: アカウント名 → パスワード（確認） */}
          <EmployeeInfoFields
            register={register}
            control={control}
            errors={errors}
            departments={departments}
          />

          {/* Section 日本語能力: tiêu đề + 資格 → 点数 (với disabled logic) */}
          <CertificationFields
            register={register}
            control={control}
            errors={errors}
            certifications={certifications}
            isCertSelected={isCertSelected}
            onCertificationChange={onCertificationChange}
          />

          {/* Nhóm button: 確認 (submit) và 戻る */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              {/* type="submit" kích hoạt onSubmit của form → handleSubmit validate */}
              <button type="submit" className="btn btn-primary btn-sm">
                確認
              </button>
              {/* type="button" tránh submit form khi click 戻る */}
              <button type="button" onClick={onBack} className="btn btn-secondary btn-sm">
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
