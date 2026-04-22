/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [page.tsx], [Apr, 2026] [ntlong]
 *
 * Trang Thêm/Sửa nhân viên (ADM004).
 * Page giữ mỏng: chỉ gọi hook và truyền toàn bộ props xuống EmployeeInputForm.
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useADM004 } from '@/hooks/useADM004';
import EmployeeInputForm from '@/components/adm004/EmployeeInputForm';

export default function EmployeeEditPage() {
  // Kiểm tra xác thực: chưa login → redirect về ADM001
  useAuth();

  // Toàn bộ state, dropdown data, handlers từ hook
  const {
    register,
    control,
    errors,
    departments,
    departmentError,
    certifications,
    certificationError,
    formError,
    errorRef,
    isCertSelected,
    handleCertificationChange,
    handleConfirm,
    handleBack,
  } = useADM004();

  return (
    <EmployeeInputForm
      register={register}
      control={control}
      errors={errors}
      departments={departments}
      departmentError={departmentError}
      certifications={certifications}
      certificationError={certificationError}
      formError={formError}
      errorRef={errorRef}
      isCertSelected={isCertSelected}
      onCertificationChange={handleCertificationChange}
      onConfirm={handleConfirm}
      onBack={handleBack}
    />
  );
}
