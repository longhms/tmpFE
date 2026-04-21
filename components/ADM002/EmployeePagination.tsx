/**
 * Copyright(C) [2026] [Luvina Software Company]
 * [EmployeePagination.tsx], [Apr, 2026] [ntlong]
 *
 * Component phan trang cho danh sach nhan vien (ADM002 - Paging).
 *
 */

/**
 * Props nhan tu component cha (EmployeeListPage).
 *
 */
type Props = {
  currentPage: number;     // Trang hien tai (0-indexed)
  totalPages: number;      // Tong so trang
  visiblePages: number[];  // Danh sach so trang hien thi (0-indexed)
  firstVisible: number;    // Trang dau tien trong visiblePages
  lastVisible: number;     // Trang cuoi cung trong visiblePages
  onPageChange: (page: number) => void;  // Callback khi click chuyen trang
};

export default function Pagination({
  currentPage,
  totalPages,
  visiblePages,
  firstVisible,
  lastVisible,
  onPageChange,
}: Props) {
  return (
    <div className="pagin">
      {/* Nut First (<<): chuyen ve trang dau tien */}
      {/* <button
        className={`btn btn-sm btn-falcon-default ${currentPage === 0 ? 'btn-disabled' : ''}`}
        onClick={() => currentPage > 0 && onPageChange(0)}
        disabled={currentPage === 0}
      >
        &laquo;
      </button> */}

      {/* Nut Previous (<): lui 1 trang */}
      <button
        className={`btn btn-sm btn-pre btn-falcon-default ${currentPage === 0 ? 'btn-disabled' : ''}`}
        onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <svg className="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
        </svg>
      </button>

      {/* Hien thi trang 1 va "..." neu trang dau visible > 0 */}
      {firstVisible > 0 && (
        <>
          <button className="btn btn-sm text-primary btn-falcon-default" onClick={() => onPageChange(0)}>1</button>
          {/* Dau "..." chi hien khi co trang bi bo qua giua trang 1 va firstVisible */}
          {firstVisible > 1 && <span className="btn btn-sm btn-falcon-default">...</span>}
        </>
      )}

      {/* Danh sach so trang hien thi (hien thi 1-indexed tren UI) */}
      {visiblePages.map((page) => (
        <button
          key={page}
          className={`btn btn-sm btn-falcon-default ${page === currentPage ? 'btn-primary text-white' : 'text-primary'}`}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </button>
      ))}

      {/* Hien thi "..." va trang cuoi neu trang cuoi visible < totalPages - 1 */}
      {lastVisible < totalPages - 1 && (
        <>
          {/* Dau "..." chi hien khi co trang bi bo qua giua lastVisible va trang cuoi */}
          {lastVisible < totalPages - 2 && <span className="btn btn-sm btn-falcon-default">...</span>}
          <button className="btn btn-sm text-primary btn-falcon-default" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}

      {/* Nut Next (>): tien 1 trang */}
      <button
        className={`btn btn-sm btn-next btn-falcon-default ${currentPage >= totalPages - 1 ? 'btn-disabled' : ''}`}
        onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        <svg className="svg-inline--fa fa-chevron-right fa-w-10" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
        </svg>
      </button>

      {/* Nut Last (>>): chuyen den trang cuoi cung */}
      {/* <button
        className={`btn btn-sm btn-falcon-default ${currentPage >= totalPages - 1 ? 'btn-disabled' : ''}`}
        onClick={() => currentPage < totalPages - 1 && onPageChange(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
      >
        &raquo;
      </button> */}
    </div>
  );
}
