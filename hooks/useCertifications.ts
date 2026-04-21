'use client';

import { useState, useEffect } from 'react';
import { Certification } from '@/types/certification';
import { fetchCertifications } from '@/services/certificationService';

/**
 * Hook lấy danh sách chứng chỉ JP cho dropdown (dùng ở ADM004).
 * Theo pattern của useDepartments: trả về data và error message khi lỗi.
 */
export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certificationError, setCertificationError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCertifications();

        // Kiểm tra code thành công, lấy danh sách chứng chỉ
        if (data.code === 200 && data.certifications) {
          setCertifications(data.certifications);
        } else {
          // API trả về lỗi → hiển thị message cố định theo requirement
          setCertificationError('資格を取得できません');
        }
      } catch {
        // Lỗi mạng hoặc exception → hiển thị message cố định
        setCertificationError('資格を取得できません');
      }
    };
    load();
  }, []);

  return { certifications, certificationError };
};
