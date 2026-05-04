/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeInfoFields.tsx], [Apr, 2026] [ntlong]
 *
 * Component hiển thị nhóm field thông tin cá nhân trong form ADM004.
 * Gồm: アカウント名, グループ, 氏名, カタカナ氏名, 生年月日, メールアドレス, 電話番号, パスワード×2.
 *
 * Nhận register/control/errors từ react-hook-form để tích hợp validation.
 * Dùng Controller cho DatePicker vì nó không hỗ trợ ref trực tiếp từ register.
 */

'use client';

import { useRef } from 'react';
import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { EmployeeFormData, FormMode } from '@/types/employee';
import { Department } from '@/types/department';
import { MODE_ADD, MODE_EDIT } from '@/lib/constants/employee';

/** Props nhận từ EmployeeInputForm */
type Props = {
  /** register của react-hook-form để đăng ký input thường */
  register: UseFormRegister<EmployeeFormData>;
  /** control của react-hook-form để dùng với Controller (DatePicker) */
  control: Control<EmployeeFormData>;
  /** Danh sách lỗi validation cho từng field */
  errors: FieldErrors<EmployeeFormData>;
  /** Danh sách phòng ban từ API, dùng để render option trong dropdown グループ */
  departments: Department[];
  /** Mode của form */
  mode: FormMode;
};

/**
 * Nhóm field thông tin cá nhân nhân viên (phần trên của form ADM004).
 * Mỗi field là 1 <li> theo cấu trúc mockup.
 */
export default function EmployeeInfoFields({ register, control, errors, departments, mode }: Props) {
  // Ref riêng để bấm icon lịch mở DatePicker — không liên quan đến field.ref của Controller
  const birthDateRef = useRef<DatePicker>(null);

  return (
    <>
      {/* アカウント名 (Tên đăng nhập) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">アカウント名:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className={`form-control${errors.loginId ? ' is-invalid' : ''}`} // class is-invalid nếu có lỗi để highlight
            {...register('loginId')}
            disabled={mode === MODE_EDIT}
            style={mode === MODE_EDIT ? { cursor: 'not-allowed' } : undefined}
          />
          {/* Hiển thị lỗi validation của từng field ngay bên dưới input */}
          {errors.loginId && (
            <div className="invalid-feedback d-block">{errors.loginId.message}</div>
          )}
        </div>
      </li>

      {/* グループ (Phòng ban) — dropdown lấy từ API departments */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">グループ:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <select className={`form-control${errors.departmentId ? ' is-invalid' : ''}`} {...register('departmentId')}>
            {/* Option đầu rỗng: bắt buộc chọn */}
            <option value="">選択してください</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <div className="invalid-feedback d-block">{errors.departmentId.message}</div>
          )}
        </div>
      </li>

      {/* 氏名 (Tên nhân viên) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">氏名:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className={`form-control${errors.employeeName ? ' is-invalid' : ''}`}
            {...register('employeeName')}
          />
          {errors.employeeName && (
            <div className="invalid-feedback d-block">{errors.employeeName.message}</div>
          )}
        </div>
      </li>

      {/* カタカナ氏名 (Tên Katakana) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">カタカナ氏名:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className={`form-control${errors.employeeNameKana ? ' is-invalid' : ''}`}
            {...register('employeeNameKana')}
          />
          {errors.employeeNameKana && (
            <div className="invalid-feedback d-block">{errors.employeeNameKana.message}</div>
          )}
        </div>
      </li>

      {/* 生年月日 (Ngày sinh) — dùng DatePicker qua Controller */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">生年月日:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10 d-flex">
          <div className="datepicker-wrapper">
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  ref={birthDateRef}
                  className={`form-control${errors.birthDate ? ' is-invalid' : ''}`}
                  placeholderText="yyyy/MM/dd"
                  // Chuyển chuỗi 'yyyy/MM/dd' → Date object để DatePicker hiển thị đúng
                  selected={
                    field.value
                      ? parse(field.value, 'yyyy/MM/dd', new Date())
                      : null
                  }
                  // Khi chọn ngày: lưu về chuỗi 'yyyy/MM/dd' vào form state
                  onChange={(date: Date | null) =>
                    field.onChange(date ? format(date, 'yyyy/MM/dd') : '')
                  }
                  onBlur={field.onBlur}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="yyyy/MM/dd"
                  onChangeRaw={(e) => e?.preventDefault()}
                />
              )}
            />
            {/* Icon lịch: click để mở DatePicker */}
            <span
              className="glyphicon glyphicon-calendar"
              onClick={() => birthDateRef.current?.setFocus()}
            />
          </div>
          {errors.birthDate && (
            <div className="invalid-feedback d-block">{errors.birthDate.message}</div>
          )}
        </div>
      </li>

      {/* メールアドレス (Email) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">メールアドレス:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className={`form-control${errors.employeeEmail ? ' is-invalid' : ''}`}
            {...register('employeeEmail')}
          />
          {errors.employeeEmail && (
            <div className="invalid-feedback d-block">{errors.employeeEmail.message}</div>
          )}
        </div>
      </li>

      {/* 電話番号 (Số điện thoại) */}
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">
          <i className="relative">電話番号:<span className="note-red">*</span></i>
        </label>
        <div className="col-sm col-sm-10">
          <input
            type="text"
            className={`form-control${errors.employeeTelephone ? ' is-invalid' : ''}`}
            {...register('employeeTelephone')}
          />
          {errors.employeeTelephone && (
            <div className="invalid-feedback d-block">{errors.employeeTelephone.message}</div>
          )}
        </div>
      </li>

      {mode === MODE_ADD && (
        <>
          {/* パスワード (Mật khẩu) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control${errors.loginPassword ? ' is-invalid' : ''}`}
                {...register('loginPassword')}
              />
              {errors.loginPassword && (
                <div className="invalid-feedback d-block">{errors.loginPassword.message}</div>
              )}
            </div>
          </li>

          {/* パスワード（確認）(Xác nhận mật khẩu) — không bắt buộc theo mockup */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード（確認）:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control${errors.loginPasswordConfirm ? ' is-invalid' : ''}`}
                {...register('loginPasswordConfirm')}
              />
              {errors.loginPasswordConfirm && (
                <div className="invalid-feedback d-block">{errors.loginPasswordConfirm.message}</div>
              )}
            </div>
          </li>
        </>
      )}
    </>
  );
}
