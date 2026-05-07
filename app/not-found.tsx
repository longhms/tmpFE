/*
 * Copyright(C) [2026] [Luvina Software Company]
 * [not-found.tsx], [Apr, 2026] [ntlong]
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ERROR_MESSAGES, formatMessage } from '@/lib/constants/messages';

/**
 * Trang 404 toàn ứng dụng.
 *
 *   - Catch mọi URL không khớp route nào (/foo, /employees/xyz, ...).
 *   - Yêu cầu đăng nhập (useAuth redirect /login nếu chưa).
 *   - Hiển thị message ER022 ("ページが見つかりません。") + nút OK -> ADM002.
 *
 * @author [ntlong]
 */
export default function NotFoundPage() {
    useAuth();
    const router = useRouter();
    const message = formatMessage(ERROR_MESSAGES.ER022);

    return (
        <div className="notification-box">
            <h1 className="title note-err">{message}</h1>
            <div className="notification-box-btn">
                <button
                    type="button"
                    onClick={() => router.push('/employees/adm002')}
                    className="btn btn-primary btn-sm"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
