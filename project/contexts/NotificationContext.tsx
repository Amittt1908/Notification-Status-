import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'reminder' | 'general';
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  showHeadsUp: boolean;
  setShowHeadsUp: (show: boolean) => void;
  currentHeadsUpNotification: NotificationItem | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showHeadsUp, setShowHeadsUp] = useState(false);
  const [currentHeadsUpNotification, setCurrentHeadsUpNotification] = useState<NotificationItem | null>(null);

  useEffect(() => {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Listen for received notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        title: notification.request.content.title || 'New Notification',
        body: notification.request.content.body || '',
        type: (notification.request.content.data?.type as any) || 'general',
        timestamp: new Date(),
        read: false,
        data: notification.request.content.data,
      };
      
      addNotification(newNotification);
      
      // Show heads-up notification
      setCurrentHeadsUpNotification(newNotification);
      setShowHeadsUp(true);
      
      // Auto-hide heads-up after 5 seconds for non-call notifications
      if (newNotification.type !== 'call') {
        setTimeout(() => {
          setShowHeadsUp(false);
        }, 5000);
      }
    });

    return () => subscription.remove();
  }, []);

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Update badge count
    const unreadCount = notifications.filter(n => !n.read).length + 1;
    Notifications.setBadgeCountAsync(unreadCount);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Update badge count
    const unreadCount = notifications.filter(n => !n.read && n.id !== id).length;
    Notifications.setBadgeCountAsync(unreadCount);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    Notifications.setBadgeCountAsync(0);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
        clearAllNotifications,
        unreadCount,
        showHeadsUp,
        setShowHeadsUp,
        currentHeadsUpNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}