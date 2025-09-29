import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
  visible: boolean;
}

interface NotificationContextType {
  notification: NotificationState | null;
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setNotification({ message, type, visible: true });
    const newTimeoutId = window.setTimeout(() => {
      setNotification(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  const value = { notification, showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
