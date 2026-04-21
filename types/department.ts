export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface DepartmentListApiResponse {
  code: number;
  departments?: Department[];
  message?: {
    code?: string;
    params?: string[];
  };
}
