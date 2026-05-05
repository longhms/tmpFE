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

import { useRef, useEffect, useCallback } from 'react';
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
} from '@/types/employee';
import { checkLoginIdDuplicate, checkCertificationNotExists, checkDepartmentNotExists, getEmployeeDetail } from '@/services/employeeService';
import { ERROR_MESSAGES, formatMessage } from '@/lib/constants/messages';
import { MODE_ADD, MODE_EDIT } from '@/lib/constants/employee';
import { FIELD } from '@/lib/constants/validation';

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

  // Lưu certification gốc từ API (chỉ dùng trong edit) để restore khi user chọn lại đúng cert cũ
  const originalCertificationRef = useRef<{
    certificationId: string | null;
    certificationStartDate: string | null;
    certificationEndDate: string | null;
    score: string | null;
  } | null>(null); // null: chưa load/chưa có edit mode

  const { departments, departmentError } = useDepartments(); // useDepartments từ hook
  const { certifications, certificationError } = useCertifications(); // danh sách chứng chỉ JP
  const selectedCertId = watch('certificationId'); // watch('certificationId') re-render component mỗi khi giá trị thay đổi
  const isCertSelected = selectedCertId !== ''; // isCertSelected = true khi người dùng đã chọn chứng chỉ (khác chuỗi rỗng)

  // Đợi dropdowns load xong (hoặc lỗi) rồi mới reset form để tránh pulldown bị rỗng do <option> chưa render.
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;

    // URL hỏng (vd ?employeeId=abc) -> redirect /system-error
    if (editIdRaw && !editId) {
      initializedRef.current = true;
      sessionStorage.setItem(SESSION_KEY_ERROR_MESSAGE, formatMessage(ERROR_MESSAGES.ER022));
      router.replace('/employees/system-error');
      return;
    }

    const departmentsReady = departments.length > 0 || !!departmentError;
    const certificationsReady = certifications.length > 0 || !!certificationError;
    if (!departmentsReady || !certificationsReady) return;
    initializedRef.current = true;

    // Ưu tiên sessionStorage (back từ ADM005). Có rồi thì không fetch API nữa
    const storedEmployeeJson = sessionStorage.getItem(SESSION_KEY_EMPLOYEE_DATA);
    if (storedEmployeeJson) {
      try {
        reset(JSON.parse(storedEmployeeJson) as EmployeeFormData);
        sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEY_EMPLOYEE_DATA);
      }
    }

    if (mode === MODE_EDIT && editId) {
      (async () => {
        const result = await getEmployeeDetail(Number(editId));
        if (result.ok && result.employee) {
          const employee = result.employee;
          const certification = employee.certifications?.[0];

          // Nếu edit mode → lưu lại cert gốc
          if (certification) {
            originalCertificationRef.current = {
              certificationId: String(certification.certificationId ?? ''),
              certificationStartDate: certification.startDate ?? '',
              certificationEndDate: certification.endDate ?? '',
              score: certification.score !== null && certification.score !== undefined ? String(certification.score) : '',
            };
          }

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
            certificationStartDate: certification?.startDate ?? '',
            certificationEndDate: certification?.endDate ?? '',
            score: certification ? String(certification.score ?? '') : '',
          });
        } else {
          sessionStorage.setItem(SESSION_KEY_ERROR_MESSAGE, result.message || formatMessage(ERROR_MESSAGES.ER015));
          router.replace('/employees/system-error');
        }
      })();
    }
  }, [departments, certifications, departmentError, certificationError, mode, editId, reset, router]);

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
      // Chọn lại đúng cert gốc (chỉ áp dụng cho edit) -> restore từ snapshot
      const original = originalCertificationRef.current;
      if (original && value === original.certificationId) {
        setValue('certificationStartDate', original.certificationStartDate ?? '', { shouldValidate: true });
        setValue('certificationEndDate', original.certificationEndDate ?? '', { shouldValidate: true });
        setValue('score', original.score ?? '', { shouldValidate: true });
        return;
      }

      // Chọn cert khác -> clear 3 field, user nhập lại
      setValue('certificationStartDate', '', { shouldValidate: true });
      setValue('certificationEndDate', '', { shouldValidate: true });
      setValue('score', '', { shouldValidate: true });
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
    let focused = false;
    const focusOnce = (): { shouldFocus: boolean } => {
      if (focused) return { shouldFocus: false };
      focused = true;
      return { shouldFocus: true };
    };

    if (isDuplicate) {
      setError('loginId', {
        type: 'server',
        message: formatMessage(ERROR_MESSAGES.ER003, [FIELD.LOGIN_ID]),
        ...focusOnce()
      });
      hasError = true;
    }

    if (deptNotExists) {
      setError('departmentId', {
        type: 'server',
        message: formatMessage(ERROR_MESSAGES.ER004, [FIELD.GROUP]),
        ...focusOnce()
      });
      hasError = true;
    }

    if (certNotExists) {
      setError('certificationId', {
        type: 'server',
        message: formatMessage(ERROR_MESSAGES.ER004, [FIELD.CERTIFICATION_ID]),
        ...focusOnce()
      });
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Lưu dữ liệu đã validate vào sessionStorage để ADM005 đọc
    sessionStorage.setItem(SESSION_KEY_EMPLOYEE_DATA, JSON.stringify(data));
    const isId = editId ? `?employeeId=${editId}` : '';
    router.push(`/employees/adm005${isId}`);
  });


  // ── Xử lý nút 戻る (Back) ──
  // Dùng router.back() thay vì router.push('/employees/adm002') để browser
  // tự khôi phục URL trước đó (có kèm query params như ?name=lo&page=2...).
  // router.push('/employees/adm002') sẽ tạo URL mới không có params → mất state.
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
