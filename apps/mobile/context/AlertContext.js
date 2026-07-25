// Popup thông báo dùng chung toàn app (thành công / lỗi) qua hook useAlert().
// Render đúng MỘT AlertModal ở gốc; các màn chỉ gọi alert.success(...) / alert.error(...).
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import AlertModal from '../components/AlertModal';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  // Giữ nội dung (type/title/message) khi ẩn để lúc fade-out KHÔNG nhấp về mặc định (success).
  const [state, setState] = useState({ visible: false });

  const hide = useCallback(() => setState((s) => ({ ...s, visible: false })), []);
  const success = useCallback(
    (title, message, opts = {}) => setState({ visible: true, type: 'success', title, message, ...opts }),
    []
  );
  const error = useCallback(
    (title, message, opts = {}) => setState({ visible: true, type: 'error', title, message, ...opts }),
    []
  );

  const value = useMemo(() => ({ success, error, hide }), [success, error, hide]);

  const onConfirm = () => {
    const cb = state.onConfirm;
    hide();
    cb?.();
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertModal
        visible={state.visible}
        type={state.type}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText ?? 'OK'}
        onConfirm={onConfirm}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert phải dùng bên trong <AlertProvider>');
  return ctx;
}
