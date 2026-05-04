/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [page.tsx], [Apr, 2026] [ntlong]
 *
 * Trang Xác nhận thông tin nhân viên (ADM005).
 * Page giữ mỏng: chỉ gọi hook và truyền props xuống EmployeeConfirmForm.
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useADM005 } from '@/hooks/useADM005';
import EmployeeConfirmForm from '@/components/adm005/EmployeeConfirmForm';

export default function EmployeeConfirmPage() {
  // Kiểm tra xác thực: chưa login → redirect về ADM001
  useAuth();

  // Toàn bộ data và handlers từ hook
  const {
    employeeFormData,
    departmentName,
    certificationName,
    submitting,
    handleOK,
    handleBack,
  } = useADM005();

  return (
    <EmployeeConfirmForm
      employeeFormData={employeeFormData}
      departmentName={departmentName}
      certificationName={certificationName}
      submitting={submitting}
      onOK={handleOK}
      onBack={handleBack}
    />
  );
}
