'use client';

import { useADM006 } from '@/hooks/useADM006';

export default function EmployeeCompletePage() {
  const { message, handleOK } = useADM006();

  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{message ?? ''}</h1>
        <div className="notification-box-btn">
          <button
            type="button"
            onClick={handleOK}
            className="btn btn-primary btn-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
