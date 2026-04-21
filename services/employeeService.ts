/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [employeeService.ts], [Apr, 2026] [ntlong]
 *
 * Service goi API lien quan den chuc nang Employee.
 * Xu ly viec build query params va goi API GET /employee.
 */

import { apiClient } from '@/lib/api/client';
import { EmployeeListApiResponse } from '@/types/employee';
import { SortField, SortOrder } from '@/lib/constants/employee';

/**
 * Interface dinh nghia cac tham so truyen vao API lay danh sach nhan vien.
 * Tuong ung voi cac query params cua API: GET /employee
 */
export interface FetchEmployeeListParams {
  employeeName: string;    // Tim kiem theo ten (LIKE %name%)
  departmentId: string;    // Loc theo phong ban (exact match)
  sortDirections: Record<SortField, SortOrder>;  // Thu tu sap xep cua 3 truong
  offset: number;          // Vi tri bat dau lay du lieu
  limit: number;           // So ban ghi toi da moi trang
}

/**
 * Goi API GET /employee de lay danh sach nhan vien.
 *
 * URL default: /employee?employee_name=&department_id=
 *          &ord_employee_name=ASC&ord_certification_name=ASC
 *          &ord_end_date=DESC&offset=0&limit=20
 *
 * Thu tu uu tien sort co dinh: employeeName -> certificationName -> endDate
 *
 * @param params Cac tham so tim kiem, sap xep, phan trang
 * @returns Promise<EmployeeListApiResponse> Ket qua tra ve tu API
 */
export const fetchEmployeeList = async (
  params: FetchEmployeeListParams
): Promise<EmployeeListApiResponse> => {
  // Build query params tu object params
  const searchParams = new URLSearchParams();

  // Luon truyen du tat ca params theo dung format API yeu cau
  searchParams.set('employee_name', params.employeeName.trim());
  searchParams.set('department_id', params.departmentId);
  searchParams.set('ord_employee_name', params.sortDirections.employeeName);
  searchParams.set('ord_certification_name', params.sortDirections.certificationName);
  searchParams.set('ord_end_date', params.sortDirections.endDate);
  searchParams.set('offset', String(params.offset));
  searchParams.set('limit', String(params.limit));

  const response = await apiClient.get<EmployeeListApiResponse>(
    `/employee?${searchParams.toString()}`
  );

  return response.data;
};

