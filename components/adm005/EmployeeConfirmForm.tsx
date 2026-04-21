/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeConfirmForm.tsx], [Apr, 2026] [ntlong]
 *
 * Component form xác nhận thông tin nhân viên (ADM005) — assembler.
 *
 */

'use client';

import { EmployeeFormData } from '@/types/adm004';
import EmployeeInfoDisplay from './EmployeeInfoDisplay';
import CertificationDisplay from './CertificationDisplay';

/** Props nhận từ confirm/page.tsx */
type Props = {
  /** Dữ liệu form đã validate — null khi đang redirect (chưa có dữ liệu) */
  employeeFormData: EmployeeFormData | null;
  /** Tên phòng ban đã tra cứu từ departments list */
  departmentName: string;
  /** Tên chứng chỉ đã tra cứu từ certifications list */
  certificationName: string;
  /** Handler nút OK (lưu vào DB) */
  onOK: () => void;
  /** Handler nút 戻る (quay lại ADM004) */
  onBack: () => void;
};

/**
 * Form xác nhận thông tin ADM005.
 */
export default function EmployeeConfirmForm({
  employeeFormData,
  departmentName,
  certificationName,
  onOK,
  onBack,
}: Props) {
  // Chưa có dữ liệu (đang redirect về ADM004) → không render để tránh hiển thị rỗng
  if (!employeeFormData) return null;

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          {/* Tiêu đề màn hình + hướng dẫn */}
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>

          {/* Section thông tin cá nhân (アカウント名 → 電話番号, không có パスワード) */}
          <EmployeeInfoDisplay
            employeeFormData={employeeFormData}
            departmentName={departmentName}
          />

          {/* Section 日本語能力 (tiêu đề + 資格 → 点数) */}
          <CertificationDisplay
            employeeFormData={employeeFormData}
            certificationName={certificationName}
          />

          {/* Nhóm button: OK (lưu DB) và 戻る (về ADM004) */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="button"
                onClick={onOK}
                className="btn btn-primary btn-sm"
              >
                OK
              </button>
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary btn-sm"
              >
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
