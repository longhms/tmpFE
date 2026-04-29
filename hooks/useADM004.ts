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
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from './useDepartments';
import { zodResolver } from '@hookform/resolvers/zod';
import { addEmployeeSchema, updateEmployeeSchema } from '@/lib/validation/employee';
import { useCertifications } from './useCertifications';
import {
  EmployeeFormData,
  FormMode,
  SESSION_KEY_EMPLOYEE_DATA,
  SESSION_KEY_ERROR_MESSAGE,
  SESSION_KEY_MODE,
} from '@/types/employee';
import { checkLoginIdDuplicate, checkCertificationNotExists, checkDepartmentNotExists, getEmployeeDetail } from '@/services/employeeService';
import { formatMessage } from '@/lib/constants/messages';
import { MODE_ADD, MODE_EDIT } from '@/lib/constants/employee';

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
  const searchParams = useSearchParams();

  //đọc edit id từ đường dẫn (?employeeId=???)
  const editIdRaw = searchParams.get('employeeId');
  //nếu có edit Id thì trả về editId còn không thì trả về null.
  const editId = editIdRaw && /^\d+$/.test(editIdRaw) ? editIdRaw : null;

  // Xác định mode: 'add' hoặc 'edit' bằng editId
  const mode: FormMode = editId ? MODE_EDIT : MODE_ADD;

  const resolverSchema = mode === MODE_ADD ? addEmployeeSchema : updateEmployeeSchema;
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
    resolver: zodResolver(resolverSchema), // Kết nối Zod schema để validate
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onBlur', // Validate ngay khi người dùng bấm vào trường
    shouldFocusError: true
  });

  const { departments, departmentError } = useDepartments(); // useDepartments từ
  const { certifications, certificationError } = useCertifications(); // danh sách chứng chỉ JP
  const selectedCertId = watch('certificationId'); // watch('certificationId') re-render component mỗi khi giá trị thay đổi
  const isCertSelected = selectedCertId !== ''; // isCertSelected = true khi người dùng đã chọn chứng chỉ (khác chuỗi rỗng)

  /**
   * 
   */
  useEffect(() => {
    const storedEmployeeJson = sessionStorage.getItem(SESSION_KEY_EMPLOYEE_DATA);
    if (storedEmployeeJson) {
      try {
        reset(JSON.parse(storedEmployeeJson) as EmployeeFormData);
      } catch {
        sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
        return;
      }
    }

    if (mode === MODE_EDIT && editId) {
      (async () => {
        const result = await getEmployeeDetail(Number(editId));
        if (result.ok && result.employee) {
          const employee = result.employee;
          const certification = employee.certifications?.[0];
          reset({
            loginId: employee.employeeLoginId,
            departmentId: String(employee.departmentId ?? ''),
            employeeName: employee.employeeName,
            employeeNameKana: employee.employeeNameKana,
            birthDate: employee.employeeBirthDate,
            employeeEmail: employee.employeeEmail,
            employeeTelephone: employee.employeeTelephone,
            loginPassword: '',
            loginPasswordConfirm: '',
            certificationId: String(certification?.certificationId ?? ''),
            certificationStartDate: certification?.startDate,
            certificationEndDate: certification?.endDate,
            score: certification ? String(certification.score ?? '') : '',
          });
        } else {
          sessionStorage.setItem(SESSION_KEY_ERROR_MESSAGE, result.message || formatMessage('ER015'));
          router.replace('/employees/system-error');
        }
      })();
    }

  }, []);


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
      mode === MODE_ADD ? checkLoginIdDuplicate(data.loginId) : Promise.resolve(false),
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
    const isId = editId ? `?employeeId=${editId}` : '';
    router.push(`/employees/confirm${isId}`);
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
