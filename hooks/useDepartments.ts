'use client';

import { useState, useEffect } from 'react';
import { Department } from '@/types/department';
import { fetchDepartments } from '@/services/departmentService';

/**
 * Hook lấy danh sách phòng ban cho dropdown.
 */
export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentError, setDepartmentError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDepartments();
        if (data.code === 200 && data.departments) {
          setDepartments(data.departments);
        } else {
          setDepartmentError('部門を取得できません');
        }
      } catch {
        setDepartmentError('部門を取得できません');
      }
    };
    load();
  }, []);

  return { departments, departmentError };
};
