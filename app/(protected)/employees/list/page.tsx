/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [page.tsx], [Apr, 2026] [ntlong]
 *
 * Trang chính danh sách nhân viên (ADM002 - List Employee).
 *
 *   useADM002 gọi useSearchParams() để đọc URL query params.
 *   component dùng useSearchParams nằm trong <Suspense>.
 */

'use client';

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useADM002 } from '@/hooks/useADM002';
import { useDepartments } from '@/hooks/useDepartments';
import SearchForm from '@/components/adm002/EmployeeSearch';
import EmployeeTableHeader from '@/components/adm002/EmployeeSortHeader';
import EmployeeTable from '@/components/adm002/EmployeeTable';
import Pagination from '@/components/adm002/EmployeePagination';

/**
 * Component thực tế: chứa toàn bộ UI và logic của ADM002.
 * Tách ra để Suspense boundary bọc đúng cấp.
 */
function EmployeeListContent() {
  // Kiểm tra xác thực: chưa login → redirect về ADM001
  useAuth();

  // Lấy danh sách phòng ban cho dropdown search
  const { departments, departmentError } = useDepartments();

  // Hook quản lý toàn bộ state và logic (đọc/ghi URL query params)
  const {
    employees, isLoading, errorMessage,
    employeeName, departmentId,
    setEmployeeName, setDepartmentId,
    handleSearch, handleSort, getSortIndicator,
    handleClickDetail, handleAddEmployee,
    currentPage, totalPages, handlePageChange,
    visiblePages, firstVisible, lastVisible, showPagination,
  } = useADM002();

  return (
    <>
      {/* Khu vực tìm kiếm: input tên, dropdown phòng ban, button 検索/新規追加 */}
      <SearchForm
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        departments={departments}
        onSearch={handleSearch}
        onAddEmployee={handleAddEmployee}
      />

      {/* Thông báo lỗi lấy danh sách phòng ban */}
      {departmentError && (
        <div className="p-3 text-danger">{departmentError}</div>
      )}

      {/* Khu vực bảng dữ liệu + phân trang */}
      <div className="row row-table">
        <div className="css-grid-table box-shadow">
          {/* Header bảng: tiêu đề cột + sort indicators */}
          <EmployeeTableHeader
            getSortIndicator={getSortIndicator}
            onSort={handleSort}
          />
          {/* Body bảng: danh sách nhân viên hoặc thông báo */}
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClickDetail={handleClickDetail}
          />
          {/* Phân trang: chỉ hiện khi có > 1 trang */}
          {showPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              visiblePages={visiblePages}
              firstVisible={firstVisible}
              lastVisible={lastVisible}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Page export: bọc EmployeeListContent trong Suspense.
 * fallback=null → không hiện loading indicator
 */
export default function EmployeeListPage() {
  return (
    <Suspense fallback={null}>
      <EmployeeListContent />
    </Suspense>
  );
}