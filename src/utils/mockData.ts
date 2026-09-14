import { Activity } from '../types/activity';
import { AppNotification } from '../types/notification';
import { getTodayDateString } from './dateHelpers';
import { colors } from '../theme/colors';

const today = getTodayDateString();

// Tomorrow's date helper
const getTomorrowDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const tomorrow = getTomorrowDate();

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Executive Sprint Planning & Alignment',
    description: 'Quarterly roadmap sync with engineering leads, product managers, and stakeholder team.',
    category: 'work',
    priority: 'urgent',
    status: 'in_progress',
    date: today,
    startTime: '09:00',
    endTime: '10:30',
    tagColor: colors.categories.work,
    hasReminder: true,
    reminderMinutesBefore: 15,
    location: 'Conference Room Alpha / Zoom',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'act-2',
    title: 'High-Intensity Interval Training (HIIT)',
    description: '30-minute cardio and strength conditioning workout at the fitness center.',
    category: 'health',
    priority: 'high',
    status: 'completed',
    date: today,
    startTime: '07:00',
    endTime: '08:00',
    tagColor: colors.categories.health,
    hasReminder: true,
    reminderMinutesBefore: 30,
    location: 'Equinox Gym',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'act-3',
    title: 'TypeScript & Distributed Systems Deep Dive',
    description: 'Review architecture patterns for resilient microservices and concurrency handling.',
    category: 'study',
    priority: 'medium',
    status: 'pending',
    date: today,
    startTime: '14:00',
    endTime: '15:30',
    tagColor: colors.categories.study,
    hasReminder: true,
    reminderMinutesBefore: 10,
    location: 'Home Study Lab',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'act-4',
    title: 'Client Strategy & Partnership Pitch',
    description: 'Present the enterprise integration prototype to international partners.',
    category: 'meeting',
    priority: 'urgent',
    status: 'pending',
    date: today,
    startTime: '16:30',
    endTime: '17:30',
    tagColor: colors.categories.meeting,
    hasReminder: true,
    reminderMinutesBefore: 15,
    location: 'Executive Boardroom',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'act-5',
    title: 'Monthly Budget & Portfolio Rebalance',
    description: 'Review expenses, check investment dividends, and update allocation sheets.',
    category: 'finance',
    priority: 'medium',
    status: 'pending',
    date: tomorrow,
    startTime: '11:00',
    endTime: '12:00',
    tagColor: colors.categories.finance,
    hasReminder: false,
    location: 'Personal Office',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'act-6',
    title: 'Dinner with Family & Friends',
    description: 'Celebrate milestone anniversary at the rooftop bistro.',
    category: 'personal',
    priority: 'low',
    status: 'pending',
    date: tomorrow,
    startTime: '19:30',
    endTime: '21:30',
    tagColor: colors.categories.personal,
    hasReminder: true,
    reminderMinutesBefore: 60,
    location: 'L’Osteria Downtown',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Urgent Activity Upcoming',
    message: '“Executive Sprint Planning & Alignment” starts in 15 minutes in Conference Room Alpha.',
    type: 'reminder',
    activityId: 'act-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isRead: false,
    priority: 'high',
  },
  {
    id: 'notif-2',
    title: 'Morning Goal Achieved! 🎉',
    message: 'You completed “High-Intensity Interval Training” on schedule. Keep up the streak!',
    type: 'achievement',
    activityId: 'act-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
    priority: 'normal',
  },
  {
    id: 'notif-3',
    title: 'Scheduler System Sync',
    message: 'All your schedules have been securely synchronized and backed up locally.',
    type: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isRead: true,
    priority: 'normal',
  },
];
