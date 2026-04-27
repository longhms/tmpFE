/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM003.ts], [Apr, 2026] [ntlong]
 *
 * Custom hook quan ly logic man hinh Chi tiet nhan vien (ADM003).
 *
 *   - Doc employeeId tu sessionStorage (da set boi ADM002 khi click vao ID).
 *   - Khong co ID -> redirect ve ADM002.
 *   - Goi GET /employee/{id} de lay du lieu.
 *   - Loi (ER013/ER015,...) -> luu message va redirect ve /employees/system-error.
 *   - handleEdit/handleDelete/handleBack: se wire tiep o cac task sau.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SESSION_KEY_EMPLOYEE_ID,
  SESSION_KEY_ERROR_MESSAGE,
  SESSION_KEY_COMPLETE_MESSAGE,
} from '@/types/adm004';
import { EmployeeDetail } from '@/types/employee';
import { getEmployeeDetail, deleteEmployee } from '@/services/employeeService';
import { formatMessage } from '@/lib/constants/messages';

export function useADM003() {
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Dung ref de chan double-fetch trong StrictMode / remount
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (typeof window === 'undefined') return;

    // ── Doc employeeId tu sessionStorage ──
    const idStr = sessionStorage.getItem(SESSION_KEY_EMPLOYEE_ID);
    const id = idStr ? Number(idStr) : NaN;
    if (!idStr || !Number.isFinite(id) || id <= 0) {
      // Truy cap truc tiep URL /employees/detail -> khong co ID -> ve list
      router.replace('/employees/list');
      return;
    }

    // ── Goi API lay chi tiet ──
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
  }, [router]);

  /**
   * Click 編集 -> chuyen ADM004 ở edit mode.
   * Chức năng edit đầy đủ sẽ được nối ở task edit sau; hiện tại chỉ điều hướng.
   */
  const handleEdit = useCallback(() => {
    if (!employee) return;
    sessionStorage.setItem(SESSION_KEY_EMPLOYEE_ID, String(employee.employeeId));
    router.push('/employees/edit');
  }, [router, employee]);

  /** Click 削除 -> mo dialog xac nhan (MSG004). */
  const handleDelete = useCallback(() => {
    setDeleteError('');
    setShowConfirm(true);
  }, []);

  /** Click Cancel trong dialog -> dong dialog. */
  const handleCancelDelete = useCallback(() => {
    setShowConfirm(false);
  }, []);

  /**
   * Click OK trong dialog -> goi DELETE /employee/{id}.
   *   Thanh cong  -> luu MSG003 -> redirect /employees/complete.
   *   ER020       -> hien loi inline, o lai trang.
   *   Loi khac    -> redirect /employees/system-error.
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
   * Click 戻る -> quay lai ADM002.
   * router.back() dam bao giu nguyen search/sort/page cua ADM002.
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
