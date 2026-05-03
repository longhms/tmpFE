/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM003.ts], [Apr, 2026] [ntlong]
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  SESSION_KEY_ERROR_MESSAGE,
  SESSION_KEY_COMPLETE_MESSAGE,
  SESSION_KEY_EMPLOYEE_DATA,
} from '@/types/employee';
import { EmployeeDetail } from '@/types/employee';
import { getEmployeeDetail, deleteEmployee } from '@/services/employeeService';
import { formatMessage } from '@/lib/constants/messages';

/**
 * Custom hook quản lý logic màn hình Chi tiết nhân viên (ADM003).
 *
 *   - Đọc employeeId từ URL params (route: /employees/detail/[employeeId]).
 *   - Không hợp lệ -> redirect về /employees/list.
 *   - Gọi GET /employee/{id} để lấy dữ liệu chi tiết.
 *   - Lỗi (ER013/ER015,...) -> lưu message và redirect về /employees/system-error.
 *   - handleEdit -> ADM004 ở chế độ edit.
 *   - handleDelete -> mở dialog xác nhận; OK gọi DELETE; ER020 hiển thị inline.
 *   - handleBack -> router.back() giữ nguyên search/sort/page của ADM002.
 *
 * @author [ntlong]
 */
export function useADM003() {
  const router = useRouter();
  const params = useParams();

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Dùng ref để chặn double-fetch trong StrictMode / remount.
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (typeof window === 'undefined') return;

    // ── Lấy employeeId từ URL params ──
    const employeeId = params?.employeeId;
    const idString = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const id = idString ? Number(idString) : NaN;
    if (!idString || !Number.isFinite(id) || id <= 0) {
      // URL không hợp lệ -> trả về list.
      router.replace('/employees/list');
      return;
    }

    // ── Gọi API lấy chi tiết ──
    (async () => {
      try {
        const result = await getEmployeeDetail(id);
        if (result.ok && result.employee) {
          setEmployee(result.employee);
        } else {
          sessionStorage.setItem(
            SESSION_KEY_ERROR_MESSAGE,
            result.message || formatMessage('ER015')
          );
          router.replace('/employees/system-error');
        }
      } catch {
        sessionStorage.setItem(
          SESSION_KEY_ERROR_MESSAGE,
          formatMessage('ER015')
        );
        router.replace('/employees/system-error');
      } finally {
        setLoading(false);
      }
    })();
  }, [router, params]);

  /**
   * Click 編集 -> chuyển sang ADM004 ở chế độ edit, đẩy id lên URL.
   */
  const handleEdit = useCallback(() => {
    if (!employee) return;
    router.push(`/employees/edit?employeeId=${employee.employeeId}`);
    sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
  }, [router, employee]);

  /**
   * Click 削除 -> mở dialog xác nhận (MSG004).
   */
  const handleDelete = useCallback(() => {
    setDeleteError('');
    setShowConfirm(true);
  }, []);

  /**
   * Click Cancel trong dialog -> đóng dialog.
   */
  const handleCancelDelete = useCallback(() => {
    setShowConfirm(false);
  }, []);

  /**
   * Click OK trong dialog -> gọi DELETE /employee/{id}.
   *   - Thành công -> lưu MSG003 và redirect /employees/complete.
   *   - ER020      -> hiển thị lỗi inline, ở lại trang.
   *   - Lỗi khác   -> redirect /employees/system-error.
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!employee) return;
    setShowConfirm(false);

    const result = await deleteEmployee(employee.employeeId);

    if (result.ok) {
      sessionStorage.setItem(SESSION_KEY_COMPLETE_MESSAGE, formatMessage('MSG003'));
      router.push('/employees/complete');
      return;
    }

    if (result.errorCode === 'ER020') {
      setDeleteError(result.message);
    } else {
      sessionStorage.setItem(
        SESSION_KEY_ERROR_MESSAGE,
        result.message || formatMessage('ER015')
      );
      router.replace('/employees/system-error');
    }
  }, [employee, router]);

  /**
   * Click 戻る -> quay lại ADM002.
   * router.back() đảm bảo giữ nguyên search/sort/page của ADM002.
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    employee,
    loading,
    handleEdit,
    handleDelete,
    handleBack,
    showConfirm,
    deleteError,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
