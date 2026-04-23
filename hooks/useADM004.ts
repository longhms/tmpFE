/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM004.ts], [Apr, 2026] [ntlong]
 *
 * Custom hook quản lý toàn bộ logic màn hình Thêm/Sửa nhân viên (ADM004).
 *
 *   - xác nhận mode (add / edit) từ sessionStorage
 *   - Khởi tạo react-hook-form với EmployeeFormData
 *   - Tải danh sách phòng ban và chứng chỉ cho dropdown
 *   - Khôi phục dữ liệu khi quay lại từ ADM005
 *   - Theo dõi certificationId để enable/disable 3 field phụ thuộc
 *   - handleConfirm: validate → lưu sessionStorage → chuyển ADM005
 *   - handleBack: về ADM002 (add) hoặc ADM003 (edit)
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDepartments } from './useDepartments';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '@/lib/validation/employee';
import { useCertifications } from './useCertifications';
import {
  EmployeeFormData,
  FormMode,
  SESSION_KEY_EMPLOYEE_DATA,
  SESSION_KEY_MODE,
} from '@/types/adm004';
import { checkLoginIdDuplicate, checkCertificationNotExists, checkDepartmentNotExists } from '@/services/employeeService';
import { formatMessage } from '@/lib/constants/messages';

/** Giá trị mặc định cho toàn bộ form (tất cả rỗng) */
const DEFAULT_FORM_VALUES: EmployeeFormData = {
  loginId: '',
  departmentId: '',
  employeeName: '',
  employeeNameKana: '',
  birthDate: '',
  employeeEmail: '',
  employeeTelephone: '',
  loginPassword: '',
  loginPasswordConfirm: '',
  certificationId: '',
  certificationStartDate: '',
  certificationEndDate: '',
  score: '',
};

export function useADM004() {
  const router = useRouter();

  // Xác định mode: 'add' (từ nút Thêm ở ADM002) hoặc 'edit' (từ ADM003) 
  // Đọc từ sessionStorage; mặc định là 'add' nếu chưa set
  const mode: FormMode =
    (typeof window !== 'undefined'
      ? (sessionStorage.getItem(SESSION_KEY_MODE) as FormMode | null)
      : null) ?? 'add';

  // react-hook-form: quản lý state và validation cho EmployeeFormData
  const {
    register,   // Đăng ký input thường (text, select, number)
    control,    // Điều khiển input không thể dùng register trực tiếp (DatePicker)
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema), // Kết nối Zod schema để validate
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onBlur', // Validate ngay khi người dùng bấm vào trường
    shouldFocusError: true
  });

  const { departments, departmentError } = useDepartments(); // useDepartments từ
  const { certifications, certificationError } = useCertifications(); // danh sách chứng chỉ JP
  const selectedCertId = watch('certificationId'); // watch('certificationId') re-render component mỗi khi giá trị thay đổi
  const isCertSelected = selectedCertId !== ''; // isCertSelected = true khi người dùng đã chọn chứng chỉ (khác chuỗi rỗng)

  // Khôi phục dữ liệu form từ sessionStorage khi người dùng bấm 戻る từ ADM005
  useEffect(() => {
    const storedEmployeeJson = sessionStorage.getItem(SESSION_KEY_EMPLOYEE_DATA);
    if (storedEmployeeJson) {
      try {
        reset(JSON.parse(storedEmployeeJson) as EmployeeFormData);
      } catch {
        // Bỏ qua nếu dữ liệu trong sessionStorage không hợp lệ (JSON parse lỗi)
      }
    } else if (mode === 'edit') {
      // Xử lí sau.
    }
    sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
  }, [reset]);


  // Khi bỏ chọn chứng chỉ (certificationId trở về '') → tự động reset 3 field phụ
  // Tránh gửi lên confirm dữ liệu thừa của lần chọn cũ
  const handleCertificationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // Khi bỏ chọn chứng chỉ (value về '') → xóa 3 field phụ để tránh gửi data thừa lên ADM005
      const value = e.target.value;
      if (!value) {
        setValue('certificationStartDate', '', { shouldValidate: true });
        setValue('certificationEndDate', '', { shouldValidate: true });
        setValue('score', '', { shouldValidate: true });
      }
    },
    [setValue]
  );


  // ── Xử lý nút 確認 (Confirm) ──
  // handleSubmit chạy validation trước; nếu pass mới gọi callback
  //check trùng và check tồn tại từ api.
  const handleConfirm = handleSubmit(async (data: EmployeeFormData) => {
    const [isDuplicate, deptNotExists, certNotExists] = await Promise.all([
      mode === 'add' ? checkLoginIdDuplicate(data.loginId) : Promise.resolve(false),
      checkDepartmentNotExists(data.departmentId),
      data.certificationId ? checkCertificationNotExists(data.certificationId) : Promise.resolve(false)
    ]);

    let hasError = false;

    if (isDuplicate) {
      setError('loginId', {
        type: 'server',
        message: formatMessage('ER003', ['アカウント名']),
      });
      hasError = true;
    }

    if (deptNotExists) {
      setError('departmentId', {
        type: 'server',
        message: formatMessage('ER004', ['グループ']),
      });
      hasError = true;
    }

    if (certNotExists) {
      setError('certificationId', {
        type: 'server',
        message: formatMessage('ER004', ['資格']),
      });
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Lưu dữ liệu đã validate vào sessionStorage để ADM005 đọc
    sessionStorage.setItem(SESSION_KEY_EMPLOYEE_DATA, JSON.stringify(data));
    router.push('/employees/confirm');
  });


  // ── Xử lý nút 戻る (Back) ──
  // Dùng router.back() thay vì router.push('/employees/list') để browser
  // tự khôi phục URL trước đó (có kèm query params như ?name=lo&page=2...).
  // router.push('/employees/list') sẽ tạo URL mới không có params → mất state.
  const handleBack = () => {
    router.back();
    sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
  };


  return {
    // Mode hiện tại
    mode,
    // react-hook-form bindings (truyền xuống component con)
    register,
    control,
    errors,
    // Dữ liệu dropdown
    departments,
    departmentError,
    certifications,
    certificationError,
    // Trạng thái chứng chỉ (dùng để enable/disable field trong CertificationFields)
    isCertSelected,
    // Handlers
    handleConfirm,
    handleBack,
    handleCertificationChange
  };
}
