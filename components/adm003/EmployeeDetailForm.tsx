/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeDetailForm.tsx], [Apr, 2026] [ntlong]
 *
 */

'use client';

import { Fragment } from 'react';
import { EmployeeDetail } from '@/types/employee';
import { formatMessage } from '@/lib/constants/messages';

type Props = {
  /** Dữ liệu chi tiết nhân viên — null khi đang load hoặc chưa có */
  employee: EmployeeDetail | null;
  /** Handler nút 編集 */
  onEdit: () => void;
  /** Handler nút 削除 — mở dialog xác nhận */
  onDelete: () => void;
  /** Handler nút 戻る */
  onBack: () => void;
  /** Hiển thị dialog xác nhận xóa */
  showConfirm: boolean;
  /** Thông báo lỗi xóa inline (ER020) */
  deleteError: string;
  /** Xác nhận xóa trong dialog */
  onConfirmDelete: () => void;
  /** Hủy xóa, đóng dialog */
  onCancelDelete: () => void;
};

/**
 * Component hiển thị chi tiết nhân viên (ADM003) — read-only.
 *
 * Gồm:
 *   - Section thông tin cá nhân: アカウント名, グループ, 氏名, カタカナ氏名,
 *     生年月日, メールアドレス, 電話番号.
 *   - Section 日本語能力: nếu có nhiều chứng chỉ -> render lặp nhóm
 *     (資格, 資格交付日, 失効日, 点数) theo sort certificationLevel DESC từ BE.
 *   - Nhóm button: 編集 / 削除 / 戻る.
 */
export default function EmployeeDetailForm({
  employee,
  onEdit,
  onDelete,
  onBack,
  showConfirm,
  deleteError,
  onConfirmDelete,
  onCancelDelete,
}: Props) {
  // Chưa có dữ liệu -> không render để tránh hiển thị rỗng
  if (!employee) return null;

  const certs = employee.certifications ?? [];

  return (
    <>
    {/* Dialog xác nhận xóa (MSG004) */}
    {showConfirm && (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div className="box-shadow" style={{ background: '#fff', padding: '32px 40px', textAlign: 'center', borderRadius: 4 }}>
          <p style={{ marginBottom: 24 }}>{formatMessage('MSG004')}</p>
          <div className="btn-group">
            <button type="button" className="btn btn-primary btn-sm" onClick={onConfirmDelete}>
              OK
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelDelete}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">情報確認</li>

          {/* ── Section thông tin cá nhân ── */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{employee.employeeLoginId}</div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">{employee.departmentName ?? ''}</div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{employee.employeeName}</div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{employee.employeeNameKana}</div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">{employee.employeeBirthDate}</div>
          </li>

          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{employee.employeeEmail}</div>
          </li>

          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
          </li>

          {/* ── Section 日本語能力 ── */}
          <li className="title mt-12">
            <a href="#!">日本語能力</a>
          </li>

          {certs.length === 0 ? (
            // Không có chứng chỉ -> vẫn hiển thị đầy đủ 4 trường, để giá trị trống.
            <Fragment>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格</label>
                <div className="col-sm col-sm-10"></div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格交付日</label>
                <div className="col-sm col-sm-10"></div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">失効日</label>
                <div className="col-sm col-sm-10"></div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">点数</label>
                <div className="col-sm col-sm-10"></div>
              </li>
            </Fragment>
          ) : (
            certs.map((c, idx) => (
              // React.Fragment với key — tránh <div> không hợp lệ trong <ul>
              <Fragment key={`${c.certificationId}-${idx}`}>
                <li className="form-group row d-flex">
                  <label className="col-form-label col-sm-2">資格</label>
                  <div className="col-sm col-sm-10">{c.certificationName}</div>
                </li>
                <li className="form-group row d-flex">
                  <label className="col-form-label col-sm-2">資格交付日</label>
                  <div className="col-sm col-sm-10">{c.startDate}</div>
                </li>
                <li className="form-group row d-flex">
                  <label className="col-form-label col-sm-2">失効日</label>
                  <div className="col-sm col-sm-10">{c.endDate}</div>
                </li>
                <li className="form-group row d-flex">
                  <label className="col-form-label col-sm-2">点数</label>
                  <div className="col-sm col-sm-10">{String(c.score)}</div>
                </li>
              </Fragment>
            ))
          )}

          {/* Lỗi xóa inline (ER020: không thể xóa admin) */}
          {deleteError && (
            <li className="form-group row d-flex">
              <div className="col-sm col-sm-10 ml text-danger">{deleteError}</div>
            </li>
          )}

          {/* ── Nhóm button ── */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="button"
                onClick={onEdit}
                className="btn btn-primary btn-sm"
              >
                編集
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="btn btn-secondary btn-sm"
              >
                削除
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
    </>
  );
}
