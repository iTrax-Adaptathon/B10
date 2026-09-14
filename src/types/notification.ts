export type NotificationType = 'reminder' | 'alert' | 'achievement' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  activityId?: string;
  timestamp: string; // ISO string
  isRead: boolean;
  priority?: 'normal' | 'high';
}
