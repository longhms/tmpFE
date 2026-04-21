import { apiClient } from '../lib/api/client';
import { DepartmentListApiResponse } from '../types/department';

/**
 * Lấy danh sách tất cả phòng ban từ API.
 */
export const fetchDepartments = async (): Promise<DepartmentListApiResponse> => {
  const response = await apiClient.get<DepartmentListApiResponse>('/departments');
  return response.data;
};
