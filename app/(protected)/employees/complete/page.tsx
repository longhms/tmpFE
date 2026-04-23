'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SESSION_KEY_COMPLETE_MESSAGE } from '@/types/adm004';
import { formatMessage } from '@/lib/constants/messages';

export default function EmployeeCompletePage() {
  useAuth();
  const router = useRouter();

  // Đọc message (MSG001/002/003) đã lưu ở useADM005.handleOK.
  // Nếu user truy cập trực tiếp /employees/complete → fallback MSG001.
  // Xoá key ngay sau khi đọc để lần sau vào không hiện lại.
  const [message, setMessage] = useState('');
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY_COMPLETE_MESSAGE);
    setMessage(stored || formatMessage('MSG001'));
    sessionStorage.removeItem(SESSION_KEY_COMPLETE_MESSAGE);
  }, []);

  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{message}</h1>
        <div className="notification-box-btn">
          <button
            type="button"
            onClick={() => router.push('/employees/list')}
            className="btn btn-primary btn-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
