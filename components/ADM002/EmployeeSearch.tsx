/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeSearch.tsx], [Apr, 2026] [ntlong]
 *
 * Component form tim kiem nhan vien (ADM002 - Search Area).
 *
 */

'use client';

import { Department } from '@/types/department';

/** Props nhan tu component cha (EmployeeListPage) */
type Props = {
  employeeName: string;               // Gia tri hien tai cua input ten
  setEmployeeName: (v: string) => void; // Setter cap nhat ten
  departmentId: string;                // Gia tri hien tai cua dropdown phong ban
  setDepartmentId: (v: string) => void; // Setter cap nhat phong ban
  departments: Department[];           // Danh sach phong ban tu API
  onSearch: () => void;                // Callback khi nhan Search
  onAddEmployee: () => void;           // Callback khi nhan 新規追加 (lưu state rồi navigate)
};

export default function SearchForm({
  employeeName,
  setEmployeeName,
  departmentId,
  setDepartmentId,
  departments,
  onSearch,
  onAddEmployee,
}: Props) {

  return (
    <div className="search-memb">
      <h1 className="title">
        会員名称で会員を検索します。検索条件無しの場合は全て表示されます。
      </h1>
      <form
        className="c-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <ul className="d-flex">
          {/* Input ten nhan vien: max 125 ky tu theo requirement */}
          <li className="form-group row">
            <label className="col-form-label">氏名:</label>
            <div className="col-sm">
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                maxLength={125}
              />
            </div>
          </li>

          {/* Dropdown phong ban: option rong = tat ca, sap xep theo ten tang dan */}
          <li className="form-group row">
            <label className="col-form-label">グループ:</label>
            <div className="col-sm">
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                {/* Option rong: hien thi tat ca nhan vien */}
                <option value="">全て</option>
                {departments.map((d) => (
                  <option key={d.departmentId} value={d.departmentId}>
                    {d.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* Nhom button: Search va Add */}
          <li className="form-group row">
            <div className="btn-group">
              {/* Button Search: submit form -> goi onSearch */}
              <button type="submit" className="btn btn-primary btn-sm">
                検索
              </button>
              {/* Button Add: goi callback de luu state ADM002 truoc khi chuyen sang ADM004 */}
              <button
                type="button"
                onClick={onAddEmployee}
                className="btn btn-secondary btn-sm"
              >
                新規追加
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
