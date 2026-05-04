/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM002.ts], [Apr, 2026] [ntlong]
 *
 * Custom hook quản lý toàn bộ logic cho trang danh sách nhân viên (ADM002).
 * Bao gồm: search, sort, pagination, data fetching, error handling,
 *           điều hướng sang trang chi tiết (ADM003) và thêm mới (ADM004).
 *
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { EmployeeListItem } from '@/types/employee';
import { fetchEmployeeList, FetchEmployeeListParams } from '@/services/employeeService';
import {
  SortField,
  SortOrder,
  DEFAULT_LIMIT,
  SORT_INDICATOR_ASC,
  SORT_INDICATOR_DESC,
} from '@/lib/constants/employee';
import { SESSION_KEY_MODE, SESSION_KEY_EMPLOYEE_DATA } from '@/types/employee';


/**
 * Đọc SortOrder an toàn từ URL param.
 * Chỉ chấp nhận 'ASC' | 'DESC', mọi giá trị khác → mặc định 'ASC'.
 */
function parseSortOrder(raw: string | null): SortOrder {
  return raw === 'DESC' ? 'DESC' : 'ASC';
}

/**
 * Tạo query string từ state ADM002 hiện tại.
 * Chỉ thêm param khi khác giá trị mặc định để giữ URL ngắn gọn:
 *   - name/department: bỏ qua nếu rỗng
 *   - page: bỏ qua nếu = 0
 *   - sort*: bỏ qua nếu = 'ASC' (mặc định)
 * Trả về chuỗi bắt đầu bằng '?' hoặc '' nếu không có param nào.
 */
function toQueryString(
  name: string,
  department: string,
  page: number,
  dirs: Record<SortField, SortOrder>
): string {
  const params = new URLSearchParams();

  if (name) params.set('name', name);
  if (department) params.set('department', department);
  if (page > 0) params.set('page', String(page));
  // Sort chỉ ghi khi DESC (ASC là mặc định, không cần lưu vào URL)
  if (dirs.employeeName !== 'ASC') params.set('sortName', dirs.employeeName);
  if (dirs.certificationName !== 'ASC') params.set('sortCert', dirs.certificationName);
  if (dirs.endDate !== 'ASC') params.set('sortEnd', dirs.endDate);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}


export function useADM002() {
  const router = useRouter();
  const pathname = usePathname();   // '/employees/adm002'
  const searchParams = useSearchParams(); // Đọc query params từ URL hiện tại

  // ── Khởi tạo state từ URL query params ──
  // useState với lazy initializer: đọc searchParams 
  // Khi user quay lại (browser back), URL đã có params → state được khôi phục tự động.
  const [employeeName, setEmployeeName] = useState<string>(
    () => searchParams.get('name') ?? ''
  );
  const [departmentId, setDepartmentId] = useState<string>(
    () => searchParams.get('department') ?? ''
  );
  const [sortDirections, setSortDirections] = useState<Record<SortField, SortOrder>>(() => ({
    employeeName: parseSortOrder(searchParams.get('sortName')),
    certificationName: parseSortOrder(searchParams.get('sortCert')),
    endDate: parseSortOrder(searchParams.get('sortEnd')),
  }));
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Validate page: phải là số nguyên không âm, ngược lại về 0
    const p = parseInt(searchParams.get('page') ?? '0', 10);
    return isNaN(p) || p < 0 ? 0 : p;
  });

  // ── Data state ──
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tổng số trang tính từ totalRecords và DEFAULT_LIMIT
  const totalPages = Math.ceil(totalRecords / DEFAULT_LIMIT);

  // ── Refs: luôn giữ giá trị mới nhất, tránh stale closure trong useCallback ──
  const employeeNameRef = useRef(employeeName);
  const departmentIdRef = useRef(departmentId);
  const sortDirectionsRef = useRef(sortDirections);
  const currentPageRef = useRef(currentPage);

  // Đồng bộ ref mỗi render (chạy trước useEffect → luôn có giá trị mới nhất)
  employeeNameRef.current = employeeName;
  departmentIdRef.current = departmentId;
  sortDirectionsRef.current = sortDirections;
  currentPageRef.current = currentPage;

  // ──────────────────────────────────────────────────────────────────────────
  // updateURL: cập nhật URL mà KHÔNG tạo history entry mới (router.replace).
  // Gọi sau mỗi action: search / sort / page change.
  // Stable callback: chỉ phụ thuộc router và pathname (cả 2 không đổi).
  // ──────────────────────────────────────────────────────────────────────────
  const updateURL = useCallback((
    name: string,
    department: string,
    page: number,
    dirs: Record<SortField, SortOrder>
  ) => {
    const qs = toQueryString(name, department, page, dirs);
    // router.replace: không tạo history entry → nút Back sẽ về trang trước (ADM003/ADM004)
    // chứ không về "state cũ của ADM002"
    router.replace(`${pathname}${qs}`);
  }, [router, pathname]);

  // ──────────────────────────────────────────────────────────────────────────
  // loadEmployees: gọi API danh sách nhân viên.
  // ──────────────────────────────────────────────────────────────────────────
  const loadEmployees = useCallback(
    async (params: FetchEmployeeListParams) => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchEmployeeList(params);

        // Backend trả về code là number (200 / 500)
        if (data.code !== 200) {
          throw new Error('従業員を取得できません');
        }

        setEmployees(data.employees ?? []);
        setTotalRecords(data.totalRecords ?? 0);
      } catch (error) {
        setEmployees([]);
        setTotalRecords(0);
        setErrorMessage(
          error instanceof Error ? error.message : '従業員を取得できません'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Build params từ refs (luôn có giá trị mới nhất) + overrides tùy chọn.
   */
  const buildParams = useCallback(
    (overrides?: {
      offset?: number;
      dirs?: Record<SortField, SortOrder>;
    }): FetchEmployeeListParams => ({
      employeeName: employeeNameRef.current,
      departmentId: departmentIdRef.current,
      sortDirections: overrides?.dirs ?? sortDirectionsRef.current,
      offset: overrides?.offset ?? 0,
      limit: DEFAULT_LIMIT,
    }),
    []
  );

  // ── Initial load: đọc offset từ URL (currentPage đã được khôi phục từ URL) ──
  // currentPageRef.current đã cập nhật trong render trước khi effect này chạy.
  useEffect(() => {
    loadEmployees(buildParams({ offset: currentPageRef.current * DEFAULT_LIMIT }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Xử lý tìm kiếm: reset về trang 0, gọi API, cập nhật URL.
   * employeeName/departmentId đọc từ ref (giá trị user đang nhập).
   */
  const handleSearch = useCallback(() => {
    setCurrentPage(0);
    loadEmployees(buildParams({ offset: 0 }));
    // Cập nhật URL với điều kiện search mới, page = 0
    updateURL(
      employeeNameRef.current,
      departmentIdRef.current,
      0,
      sortDirectionsRef.current
    );
  }, [loadEmployees, buildParams, updateURL]);

  /**
   * Xử lý sort: toggle ASC ↔ DESC cho 1 trường.
   * Reset về trang 0, giữ nguyên điều kiện search.
   */
  const handleSort = useCallback(
    (field: SortField) => {
      // Toggle direction cho field được click
      const newDirs: Record<SortField, SortOrder> = { ...sortDirectionsRef.current };
      newDirs[field] = newDirs[field] === 'ASC' ? 'DESC' : 'ASC';

      setSortDirections(newDirs);
      setCurrentPage(0);
      loadEmployees(buildParams({ offset: 0, dirs: newDirs }));
      // Cập nhật URL với sort direction mới
      updateURL(
        employeeNameRef.current,
        departmentIdRef.current,
        0,
        newDirs
      );
    },
    [loadEmployees, buildParams, updateURL]
  );

  /**
   * Xử lý chuyển trang: giữ nguyên search + sort.
   * offset = page * DEFAULT_LIMIT.
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      loadEmployees(buildParams({ offset: page * DEFAULT_LIMIT }));
      // Cập nhật URL với page mới
      updateURL(
        employeeNameRef.current,
        departmentIdRef.current,
        page,
        sortDirectionsRef.current
      );
    },
    [loadEmployees, buildParams, updateURL]
  );

  /**
   * Xử lý click ID nhân viên → trang chi tiết (ADM003).
   * Đẩy id lên URL: /employees/adm003/{employeeId} → trang ADM003 đọc params.
   * URL ADM002 (có query params) vẫn nằm trong browser history,
   * khi user bấm Back từ ADM003 thì state tự restore.
   */
  const handleClickDetail = useCallback(
    (employeeId: number) => {
      router.push(`/employees/adm003/${employeeId}`);
    },
    [router]
  );

  /**
   * Xử lý click 新規追加 → trang thêm mới nhân viên (ADM004, add mode).
   * Tương tự handleClickDetail: URL ADM002 vẫn trong history → tự khôi phục khi Back.
   */
  const handleAddEmployee = useCallback(() => {
    router.push('/employees/adm004');
  }, [router]);

  /**
   * Trả về sort indicator cho 1 trường để hiển thị trên header.
   */
  const getSortIndicator = useCallback(
    (field: SortField): string =>
      sortDirections[field] === 'ASC' ? SORT_INDICATOR_ASC : SORT_INDICATOR_DESC,
    [sortDirections]
  );

  /**
   * Danh sách số trang hiển thị xung quanh currentPage (±1).
   */
  const visiblePages: number[] = useMemo(() => {
    if (totalPages <= 1) return [];
    const start = Math.max(0, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const firstVisible = visiblePages[0] ?? 0;
  const lastVisible = visiblePages[visiblePages.length - 1] ?? 0;
  const showPagination = totalPages > 1;

  return {
    // Data
    employees,
    totalRecords,
    isLoading,
    errorMessage,
    // Search
    employeeName,
    departmentId,
    setEmployeeName,
    setDepartmentId,
    handleSearch,
    // Sort
    handleSort,
    getSortIndicator,
    // Navigation
    handleClickDetail,
    handleAddEmployee,
    // Pagination
    currentPage,
    totalPages,
    handlePageChange,
    visiblePages,
    firstVisible,
    lastVisible,
    showPagination,
  };
}