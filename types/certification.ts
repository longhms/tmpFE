export interface Certification {
    certificationId: number;
    certificationName: string;
    certificationLevel: number;
}

export interface CertificationListApiResponse {
    code: number;
    certifications?: Certification[];
    message?: {
      code?: string;
      params?: string[];
    };
  }
  