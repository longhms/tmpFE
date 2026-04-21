import { apiClient } from '../lib/api/client';
import { CertificationListApiResponse } from '../types/certification';

/**
 * Lấy danh sách tất cả chứng chỉ từ API (GET /certification).
 * Backend trả về theo thứ tự certificationLevel tăng dần.
 */
export const fetchCertifications = async (): Promise<CertificationListApiResponse> => {
  const response = await apiClient.get<CertificationListApiResponse>('/certification');
  return response.data;
};
