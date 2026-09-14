import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppNotification } from '../types/notification';
import { storage } from '../utils/storage';
import { initialNotifications } from '../utils/mockData';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => Promise<AppNotification>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initNotifications = async () => {
      setIsLoading(true);
      const saved = await storage.loadNotifications();
      if (saved && saved.length > 0) {
        setNotifications(saved);
      } else {
        setNotifications(initialNotifications);
        await storage.saveNotifications(initialNotifications);
      }
      setIsLoading(false);
    };
    initNotifications();
  }, []);

  const persistNotifications = async (newList: AppNotification[]) => {
    setNotifications(newList);
    await storage.saveNotifications(newList);
  };

  const addNotification = async (
    data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>
  ): Promise<AppNotification> => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const updated = [newNotif, ...notifications];
    await persistNotifications(updated);
    return newNotif;
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    await persistNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    await persistNotifications(updated);
  };

  const deleteNotification = async (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    await persistNotifications(updated);
  };

  const clearAllNotifications = async () => {
    await persistNotifications([]);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
