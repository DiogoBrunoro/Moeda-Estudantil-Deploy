"use client"

import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '@/components/notification';
import { NotificationType } from '@/components/notification';
import { v4 as uuidv4 } from 'uuid'; 

interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType, duration?: number) => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {notifications.map((notif) => (
          <div key={notif.id} className="pointer-events-auto">
            <Notification
              id={notif.id}
              message={notif.message}
              type={notif.type}
              duration={notif.duration}
              onClose={removeNotification}
            />
          </div>
        ))}
      </div>
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