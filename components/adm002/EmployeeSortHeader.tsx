/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeeSortHeader.tsx], [Apr, 2026] [ntlong]
 *
 * Component header cua bang danh sach nhan vien (ADM002 - Table Header).
 */

import { SortField } from '@/lib/constants/employee';

/** Props nhan tu component cha (EmployeeListPage) */
type Props = {
  getSortIndicator: (field: SortField) => string;  // Ham lay sort indicator hien tai
  onSort: (field: SortField) => void;               // Callback khi click sort
};

/**
 * Header cua bang nhan vien.
 * Gom 9 cot, trong do 3 cot co the click de sort.
 */
export default function EmployeeTableHeader({ getSortIndicator, onSort }: Props) {
  return (
    <div className="css-grid-table-header">
      <div>ID</div>
      {/* Cot Ten: ho tro sort (click toggle ASC/DESC) */}
      <SortableHeader label="氏名" field="employeeName" indicator={getSortIndicator('employeeName')} onSort={onSort} />
      <div>生年月日</div>
      <div>グループ</div>
      <div>メールアドレス</div>
      <div>電話番号</div>
      {/* Cot Chung chi: ho tro sort (click toggle ASC/DESC) */}
      <SortableHeader label="日本語能力" field="certificationName" indicator={getSortIndicator('certificationName')} onSort={onSort} />
      {/* Cot Ngay het han: ho tro sort (click toggle ASC/DESC) */}
      <SortableHeader label="失効日" field="endDate" indicator={getSortIndicator('endDate')} onSort={onSort} />
      <div>点数</div>
    </div>
  );
}

/**
 * Component con: header cot co the sort.
 * Hien thi label + sort indicator, click de goi onSort.
 *
 * @param label     Tieu de cot (tieng Nhat)
 * @param field     Ten truong sort tuong ung
 * @param indicator Ky hieu sort hien tai (VD: "▲▽")
 * @param onSort    Callback khi click
 */
function SortableHeader({
  label,
  field,
  indicator,
  onSort,
}: {
  label: string;
  field: SortField;
  indicator: string;
  onSort: (field: SortField) => void;
}) {
  return (
    <div onClick={() => onSort(field)} style={{ cursor: 'pointer' }}>
      {label} {indicator}
    </div>
  );
}
