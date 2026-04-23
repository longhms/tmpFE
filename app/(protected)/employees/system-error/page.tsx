'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SESSION_KEY_ERROR_MESSAGE } from '@/types/adm004';
import { formatMessage } from '@/lib/constants/messages';

export default function SystemErrorPage() {
    useAuth();
    const router = useRouter();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const stored = sessionStorage.getItem(SESSION_KEY_ERROR_MESSAGE);
        setMessage(stored || formatMessage('ER015'));
        sessionStorage.removeItem(SESSION_KEY_ERROR_MESSAGE);
    }, []);

    return (
        <div className="box-shadow">
            <div className="notification-box">
                <h1 className="title note-err">{message}</h1>
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