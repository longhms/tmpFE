/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [employee.ts], [Apr, 2026] [ntlong]
 *
 * Hang so cho chuc nang Employee List (ADM002).
 * Bao gom: sort types, paging defaults, sort indicators.
 */

/** Kieu du lieu cho thu tu sap xep: chi chap nhan 'ASC' hoac 'DESC' */
export type SortOrder = 'ASC' | 'DESC';

/** Cac truong ho tro sap xep trong bang danh sach nhan vien */
export type SortField = 'employeeName' | 'certificationName' | 'endDate';

/** So ban ghi toi da hien thi tren 1 trang (requirement: 20 records/page) */
export const DEFAULT_LIMIT = 20;

/** Huong sap xep mac dinh cho moi truong khi khoi tao man hinh (tat ca la ASC) */
export const DEFAULT_SORT_DIRECTIONS: Record<SortField, SortOrder> = {
  employeeName: 'ASC',
  certificationName: 'ASC',
  endDate: 'ASC',
};

/** Ky hieu sort indicator hien thi tren header cua bang */
export const SORT_INDICATOR_ASC = '▲▽';   // ASC
export const SORT_INDICATOR_DESC = '△▼';  // DESC
