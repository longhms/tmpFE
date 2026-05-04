/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [useADM006.ts], [Apr, 2026] [ntlong]
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SESSION_KEY_COMPLETE_MESSAGE } from '@/types/employee';

/**
 * Hook quản lý logic màn hình hoàn thành thao tác nhân viên (ADM006).
 *
 * Đọc message (MSG001/002/003) từ sessionStorage do các hook trước lưu lại.
 * Nếu không có message (truy cập trực tiếp URL) → redirect về danh sách.
 *
 * useState initializer chạy 1 lần duy nhất kể cả Strict Mode → an toàn để đọc + xóa sessionStorage.
 *
 * @returns message hiển thị và handleOK để quay về danh sách
 */
export function useADM006() {
  useAuth();
  const router = useRouter();

  const [message] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem(SESSION_KEY_COMPLETE_MESSAGE);
    sessionStorage.removeItem(SESSION_KEY_COMPLETE_MESSAGE);
    return stored || null;
  });

  useEffect(() => {
    if (message === null) router.replace('/employees/adm002');
  }, [message, router]);

  const handleOK = () => router.push('/employees/adm002');

  return { message, handleOK };
}
