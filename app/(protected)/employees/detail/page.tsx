/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [page.tsx], [Apr, 2026] [ntlong]
 *
 * Man hinh ADM003 - Chi tiet nhan vien.
 * Doc employeeId tu sessionStorage (ADM002 set) -> goi GET /employee/{id} ->
 * hien thi qua EmployeeDetailForm.
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useADM003 } from '@/hooks/useADM003';
import EmployeeDetailForm from '@/components/adm003/EmployeeDetailForm';

export default function EmployeeDetailPage() {
  useAuth();

  const {
    employee, loading,
    handleEdit, handleDelete, handleBack,
    showConfirm, deleteError,
    handleConfirmDelete, handleCancelDelete,
  } = useADM003();

  // Dang tai du lieu -> khong render de tranh flash
  if (loading) return null;

  return (
    <EmployeeDetailForm
      employee={employee}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
      showConfirm={showConfirm}
      deleteError={deleteError}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleCancelDelete}
    />
  );
}
