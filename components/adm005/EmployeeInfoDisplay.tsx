/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeInfoDisplay.tsx], [Apr, 2026] [ntlong]
 *
 * Component hiển thị section thông tin cá nhân nhân viên trong ADM005 (readonly).
 * Gồm: アカウント名, グループ, 氏名, カタカナ氏名, 生年月日, メールアドレス, 電話番号.
 *
 */

'use client';

import { EmployeeFormData } from '@/types/adm004';

/** Props nhận từ EmployeeConfirmForm */
type Props = {
  /** Dữ liệu form đã validate từ ADM004 */
  employeeFormData: EmployeeFormData;
  /** Tên phòng ban tra cứu từ departmentId (hiển thị thay vì ID số) */
  departmentName: string;
};

/**
 * Hiển thị section thông tin cá nhân dạng readonly.
 */
export default function EmployeeInfoDisplay({ employeeFormData, departmentName }: Props) {
  return (
    <>
      {/* アカウント名 (Tên đăng nhập) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">アカウント名</label>
        <div className="col-sm col-sm-10">{employeeFormData.loginId}</div>
      </li>

      {/* グループ (Tên phòng ban — hiển thị tên, không phải ID) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">グループ</label>
        <div className="col-sm col-sm-10">{departmentName}</div>
      </li>

      {/* 氏名 (Tên nhân viên) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">氏名</label>
        <div className="col-sm col-sm-10">{employeeFormData.employeeName}</div>
      </li>

      {/* カタカナ氏名 (Tên Katakana) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">カタカナ氏名</label>
        <div className="col-sm col-sm-10">{employeeFormData.employeeNameKana}</div>
      </li>

      {/* 生年月日 (Ngày sinh) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">生年月日</label>
        <div className="col-sm col-sm-10">{employeeFormData.birthDate}</div>
      </li>

      {/* メールアドレス (Email) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">メールアドレス</label>
        <div className="col-sm col-sm-10">{employeeFormData.employeeEmail}</div>
      </li>

      {/* 電話番号 (Số điện thoại) — field cuối của section, bỏ border dưới theo mockup */}
      <li className="form-group row d-flex bor-none">
        <label className="col-form-label col-sm-2">電話番号</label>
        <div className="col-sm col-sm-10">{employeeFormData.employeeTelephone}</div>
      </li>
    </>
  );
}
