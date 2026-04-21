/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeTable.tsx], [Apr, 2026] [ntlong]
 *
 * Component hien thi bang du lieu danh sach nhan vien (ADM002 - Table Body).
 *
 */

'use client';

import { Fragment } from 'react';
import { EmployeeListItem } from '@/types/employee';
import { formatMessage } from '@/lib/constants/messages';

/** Props nhan tu component cha (EmployeeListPage) */
interface Props {
  employees: EmployeeListItem[];  // Danh sach nhan vien tu API
  isLoading: boolean;              // Trang thai dang tai du lieu
  errorMessage: string;            // Thong bao loi (neu co)
  onClickDetail?: (employeeId: number) => void; // Callback khi click vao ID nhan vien
}

export default function EmployeeTable({
  employees,
  isLoading,
  errorMessage,
  onClickDetail,
}: Props) {

  // Hien thi trang thai loading khi dang goi API
  if (isLoading) return <div className="p-3">Loading...</div>;

  // Hien thi thong bao loi (VD: loi he thong, loi validate tu API)
  if (errorMessage) return <div className="p-3 text-danger">{errorMessage}</div>;

  // Hien thi thong bao khong tim thay ket qua (MSG005)
  if (employees.length === 0)
    return <div className="p-3" style={{ textAlign: 'center', padding: '5px'}}>
        {formatMessage("MSG005")}
      </div>;

  return (
    <div className="css-grid-table-body">
      {employees.map((e, index) => (
        <Fragment
          key={`${e.employeeId}-${e.certificationName ?? 'none'}-${
            e.endDate ?? 'none'
          }-${index}`}
        >
          {/*
            Moi cell them thuoc tinh `title` de khi text bi cat boi ellipsis
            (CSS overflow: hidden + text-overflow: ellipsis), nguoi dung
            hover chuot se thay noi dung day du qua tooltip mac dinh cua trinh duyet.
          */}
          {/* Cot ID: hien thi dang link, click -> chuyen den ADM003 */}
          <div className="bor-l-none text-center" title={String(e.employeeId)}>
            <a
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                onClickDetail?.(e.employeeId);
              }}
            >
              {e.employeeId}
            </a>
          </div>
          <div title={e.employeeName}>{e.employeeName}</div>
          <div title={e.employeeBirthDate ?? undefined}>{e.employeeBirthDate}</div>
          <div title={e.departmentName ?? undefined}>{e.departmentName}</div>
          <div title={e.employeeEmail ?? undefined}>{e.employeeEmail}</div>
          <div title={e.employeeTelephone ?? undefined}>{e.employeeTelephone}</div>
          <div title={e.certificationName ?? ''}>{e.certificationName}</div>
          <div title={e.endDate ?? ''}>{e.endDate}</div>
          {/* Score co the null (nhan vien chua co chung chi) */}
          <div title={e.score != null ? String(e.score) : ''}>{e.score ?? ''}</div>
        </Fragment>
      ))}
    </div>
  );
}
