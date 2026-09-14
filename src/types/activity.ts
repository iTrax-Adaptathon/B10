export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type ActivityCategory = 
  | 'work' 
  | 'personal' 
  | 'health' 
  | 'study' 
  | 'meeting' 
  | 'finance'
  | 'other';

export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type ActivityType = 'fixed' | 'flexible';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  priority: PriorityLevel;
  status: ActivityStatus;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  tagColor: string; // Hex color string
  hasReminder: boolean;
  reminderMinutesBefore?: number;
  location?: string;
  type?: ActivityType;
  duration?: number; // In minutes
  fixedStartTime?: string;
  fixedEndTime?: string;
  dependencies?: string[];
  resources?: string[];
  preferredStart?: string;
  preferredEnd?: string;
  preferredStartTime?: string;
  preferredEndTime?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityFilter = 'all' | 'today' | 'upcoming' | 'completed' | 'high_priority';

export type ActivitySortBy = 'time' | 'priority' | 'category' | 'title';

export interface ActivityFormData {
  title: string;
  description: string;
  category: ActivityCategory;
  priority: PriorityLevel;
  date: string;
  startTime: string;
  endTime: string;
  tagColor: string;
  hasReminder: boolean;
  reminderMinutesBefore?: number;
  location?: string;
  type?: ActivityType;
  duration?: number;
  fixedStartTime?: string;
  fixedEndTime?: string;
  dependencies?: string[];
  resources?: string[];
  preferredStart?: string;
  preferredEnd?: string;
  preferredStartTime?: string;
  preferredEndTime?: string;
  deadline?: string;
}

export interface DashboardMetrics {
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  inProgressActivities: number;
  completionRate: number;
  todayTotal: number;
  todayCompleted: number;
  urgentCount: number;
}
