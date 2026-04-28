/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM005.ts], [Apr, 2026] [ntlong]
 *
 * Custom hook quản lý logic màn hình Xác nhận thông tin nhân viên (ADM005).
 *
 *   - Đọc EmployeeFormData từ sessionStorage (đã validate và lưu ở ADM004)
 *   - Nếu không có data → redirect về ADM004 (chặn truy cập trực tiếp URL)
 *   - Tra cứu departmentName + certificationName từ ID để hiển thị
 *   - handleOK: gọi API lưu → chuyển sang ADM006 (hoàn thành)
 *   - handleBack: router.back() → quay lại ADM004 với dữ liệu form vẫn còn trong sessionStorage
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDepartments } from './useDepartments';
import { useCertifications } from './useCertifications';
import {
  EmployeeFormData,
  SESSION_KEY_EMPLOYEE_DATA,
  SESSION_KEY_COMPLETE_MESSAGE,
  SESSION_KEY_ERROR_MESSAGE,
} from '@/types/employee';
import { createEmployee } from '@/services/employeeService';
import { formatMessage } from '@/lib/constants/messages';

export function useADM005() {
  const router = useRouter();

  // ── Đọc dữ liệu form đã validate từ sessionStorage ──
  // Dữ liệu được lưu bởi ADM004 sau khi react-hook-form validate thành công.
  const [employeeFormData] = useState<EmployeeFormData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedEmployeeJson = sessionStorage.getItem(SESSION_KEY_EMPLOYEE_DATA);
      return storedEmployeeJson
        ? (JSON.parse(storedEmployeeJson) as EmployeeFormData)
        : null;
    } catch {
      // JSON parse lỗi → data không hợp lệ → trả null để trigger redirect
      return null;
    }
  });

  // ── không có data trên session → redirect về form ──
  // Tránh người dùng truy cập trực tiếp /employees/confirm mà không qua ADM004
  useEffect(() => {
    if (employeeFormData === null) {
      router.replace('/employees/edit');
    }
  }, [employeeFormData, router]);

  // ── Tải danh sách phòng ban và chứng chỉ để tra cứu tên hiển thị ──
  const { departments } = useDepartments();
  const { certifications } = useCertifications();

  // ── Tra cứu tên phòng ban từ departmentId ──
  // useMemo tự cập nhật khi departments hoặc departmentId thay đổi
  const departmentName = useMemo(
    () =>
      departments.find(
        (d) => String(d.departmentId) === employeeFormData?.departmentId
      )?.departmentName ?? '',
    [departments, employeeFormData?.departmentId]
  );

  // ── Tra cứu tên chứng chỉ từ certificationId ──
  const certificationName = useMemo(
    () =>
      certifications.find(
        (c) => String(c.certificationId) === employeeFormData?.certificationId
      )?.certificationName ?? '',
    [certifications, employeeFormData?.certificationId]
  );

  const [submitting, setSubmitting] = useState(false);

  // ── handleOK: gọi POST /employee, thành công → chuyển ADM006 ──
  const handleOK = useCallback(async () => {
    if (!employeeFormData || submitting) return;
    setSubmitting(true);
    try {
      const result = await createEmployee(employeeFormData);
      if (result.ok) {
        sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
        sessionStorage.setItem(SESSION_KEY_COMPLETE_MESSAGE, result.message);
        router.push('/employees/complete');
      } else {
        sessionStorage.setItem(SESSION_KEY_ERROR_MESSAGE, result.message || formatMessage('ER015'));
        router.push('/employees/system-error');
      }
    } catch {
      sessionStorage.setItem(SESSION_KEY_ERROR_MESSAGE, formatMessage('ER015'));
      router.push('/employees/system-error');
    } finally {
      setSubmitting(false);
    }
  }, [employeeFormData, submitting, router]);

  // ── handleBack: quay lại ADM004 với dữ liệu form vẫn còn trong sessionStorage ──
  // router.back() đảm bảo ADM004 khôi phục đúng trạng thái form trước đó
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    employeeFormData,
    departmentName,
    certificationName,
    submitting,
    handleOK,
    handleBack,
  };
}
