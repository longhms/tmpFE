/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [CertificationFields.tsx], [Apr, 2026] [ntlong]
 *
 * Component hiển thị nhóm field 日本語能力 (Năng lực tiếng Nhật) trong form ADM004.
 * Gồm: 資格 (dropdown), 資格交付日, 失効日, 点数.
 *
 */

'use client';

import { useRef } from 'react';
import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { EmployeeFormData } from '@/types/adm004';
import { Certification } from '@/types/certification';

/** Props nhận từ EmployeeInputForm */
type Props = {
  /** register của react-hook-form để đăng ký input thường */
  register: UseFormRegister<EmployeeFormData>;
  /** control của react-hook-form để dùng với Controller (DatePicker) */
  control: Control<EmployeeFormData>;
  /** Danh sách lỗi validation cho từng field */
  errors: FieldErrors<EmployeeFormData>;
  /** Danh sách chứng chỉ từ API, dùng để render option trong dropdown 資格 */
  certifications: Certification[];
  /**
   * true khi người dùng đã chọn 1 chứng chỉ (certificationId !== '').
   * Dùng để bật/tắt 3 field: 資格交付日, 失効日, 点数.
   */
  isCertSelected: boolean;
  /** Callback từ useADM004 — xóa 3 field phụ khi bỏ chọn chứng chỉ */
  onCertificationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * Nhóm field 日本語能力 trong form ADM004.
 * Render tiêu đề section + 4 field, mỗi field là 1 <li>.
 */
export default function CertificationFields({
  register,
  control,
  errors,
  certifications,
  isCertSelected,
  onCertificationChange,
}: Props) {
  // Ref riêng cho 2 DatePicker — dùng để mở lịch khi click icon
  const startDateRef = useRef<DatePicker>(null);
  const endDateRef = useRef<DatePicker>(null);

  return (
    <>
      {/* Tiêu đề section 日本語能力 */}
      <li className="title mt-12">
        <a href="#!">日本語能力</a>
      </li>

      {/* 資格 (Chứng chỉ JP) — dropdown, không bắt buộc chọn */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">資格:</i>
        </label>
        <div className="col-sm col-sm-10">
          {/* onChange trong register options chạy song song với onChange nội bộ của RHF */}
          <select
            className="form-control"
            {...register('certificationId', { onChange: onCertificationChange })}
          >
            {/* Option rỗng = không có chứng chỉ → 3 field dưới bị disable */}
            <option value="">選択してください</option>
            {certifications.map((c) => (
              <option key={c.certificationId} value={c.certificationId}>
                {c.certificationName}
              </option>
            ))}
          </select>
          {errors.certificationId && (
            <div className="invalid-feedback d-block">{errors.certificationId.message}</div>
          )}
        </div>
      </li>

      {/* 資格交付日 (Ngày cấp chứng chỉ) — disable khi chưa chọn 資格 */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">
            資格交付日:
            {/* Dấu * chỉ hiện khi đang enabled (đã chọn chứng chỉ) */}
            {isCertSelected && <span className="note-red">*</span>}
          </i>
        </label>
        <div className="col-sm col-sm-10 d-flex">
          <div className="datepicker-wrapper">
            <Controller
              name="certificationStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  ref={startDateRef}
                  placeholderText="yyyy/MM/dd"
                  // disabled khi chưa chọn chứng chỉ
                  disabled={!isCertSelected}
                  selected={
                    field.value
                      ? parse(field.value, 'yyyy/MM/dd', new Date())
                      : null
                  }
                  onChange={(date: Date | null) =>
                    field.onChange(date ? format(date, 'yyyy/MM/dd') : '')
                  }
                  dateFormat="yyyy/MM/dd"
                />
              )}
            />
            <span
              className="glyphicon glyphicon-calendar"
              // Chỉ cho phép mở lịch khi field đang enabled
              onClick={() => isCertSelected && startDateRef.current?.setFocus()}
            />
          </div>
          {errors.certificationStartDate && (
            <div className="invalid-feedback d-block">
              {errors.certificationStartDate.message}
            </div>
          )}
        </div>
      </li>

      {/* 失効日 (Ngày hết hạn chứng chỉ) — disable khi chưa chọn 資格 */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">
            失効日:
            {isCertSelected && <span className="note-red">*</span>}
          </i>
        </label>
        <div className="col-sm col-sm-10 d-flex">
          <div className="datepicker-wrapper">
            <Controller
              name="certificationEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  ref={endDateRef}
                  placeholderText="yyyy/MM/dd"
                  disabled={!isCertSelected}
                  selected={
                    field.value
                      ? parse(field.value, 'yyyy/MM/dd', new Date())
                      : null
                  }
                  onChange={(date: Date | null) =>
                    field.onChange(date ? format(date, 'yyyy/MM/dd') : '')
                  }
                  dateFormat="yyyy/MM/dd"
                />
              )}
            />
            <span
              className="glyphicon glyphicon-calendar"
              onClick={() => isCertSelected && endDateRef.current?.setFocus()}
            />
          </div>
          {errors.certificationEndDate && (
            <div className="invalid-feedback d-block">
              {errors.certificationEndDate.message}
            </div>
          )}
        </div>
      </li>

      {/* 点数 (Điểm chứng chỉ) — disable khi chưa chọn 資格 */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">
            点数:
            {isCertSelected && <span className="note-red">*</span>}
          </i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className="form-control"
            // disabled thuộc tính HTML: react-hook-form tự bỏ qua field disabled khi submit
            disabled={!isCertSelected}
            {...register('score')}
          />
          {errors.score && (
            <div className="invalid-feedback d-block">{errors.score.message}</div>
          )}
        </div>
      </li>
    </>
  );
}
