import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types/activity';
import { AppNotification } from '../types/notification';
import { Commitment } from '../types/commitment';

const ACTIVITIES_KEY = '@chronos_activities_v1';
const NOTIFICATIONS_KEY = '@chronos_notifications_v1';
const COMMITMENTS_KEY = '@chronos_commitments_v1';

export const storage = {
  async saveActivities(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities to storage', e);
    }
  },

  async loadActivities(): Promise<Activity[] | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVITIES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading activities from storage', e);
      return null;
    }
  },

  async saveNotifications(notifications: AppNotification[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications to storage', e);
    }
  },

  async loadNotifications(): Promise<AppNotification[] | null> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading notifications from storage', e);
      return null;
    }
  },

  async saveCommitments(commitments: Commitment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(COMMITMENTS_KEY, JSON.stringify(commitments));
    } catch (e) {
      console.error('Error saving commitments to storage', e);
    }
  },

  async loadCommitments(): Promise<Commitment[] | null> {
    try {
      const data = await AsyncStorage.getItem(COMMITMENTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading commitments from storage', e);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACTIVITIES_KEY, NOTIFICATIONS_KEY, COMMITMENTS_KEY]);
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  },
};
