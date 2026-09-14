import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Activity, ActivityFormData, ActivityStatus, DashboardMetrics } from '../types/activity';
import { storage } from '../utils/storage';
import { initialActivities } from '../utils/mockData';
import { getTodayDateString } from '../utils/dateHelpers';
import { supabaseActivityService } from '../services/supabaseActivityService';
import { isSupabaseConfigured } from '../services/supabaseConfig';

interface ActivityContextType {
  activities: Activity[];
  isLoading: boolean;
  isCloudSyncing: boolean;
  addActivity: (data: ActivityFormData) => Promise<Activity>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  toggleCompleteActivity: (id: string) => Promise<void>;
  getActivityById: (id: string) => Activity | undefined;
  getActivitiesByDate: (date: string) => Activity[];
  metrics: DashboardMetrics;
  refreshActivities: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Load activities from local storage first, then sync with Supabase if configured
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const saved = await storage.loadActivities();
      if (saved && saved.length > 0) {
        setActivities(saved);
      } else {
        setActivities(initialActivities);
        await storage.saveActivities(initialActivities);
      }
      setIsLoading(false);

      // Cloud Sync in background
      if (isSupabaseConfigured()) {
        try {
          setIsCloudSyncing(true);
          const remoteActivities = await supabaseActivityService.fetchActivities();
          if (remoteActivities && remoteActivities.length > 0) {
            setActivities(remoteActivities);
            await storage.saveActivities(remoteActivities);
          } else if (saved && saved.length > 0) {
            // Push local activities to Supabase if remote is empty
            for (const item of saved) {
              await supabaseActivityService.upsertActivity(item);
            }
          }
        } catch (err) {
          console.warn('Background Supabase activity sync notice:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    };

    initData();
  }, []);

  // Save changes to storage & background sync to Supabase
  const persistActivities = async (newList: Activity[]) => {
    setActivities(newList);
    await storage.saveActivities(newList);
  };

  const addActivity = async (data: ActivityFormData): Promise<Activity> => {
    const newActivity: Activity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newActivity, ...activities];
    await persistActivities(updated);

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      supabaseActivityService.upsertActivity(newActivity).catch((err) => {
        console.warn('Failed to push new activity to Supabase:', err);
      });
    }

    return newActivity;
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    let targetActivity: Activity | undefined;
    const updated = activities.map((item) => {
      if (item.id === id) {
        targetActivity = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return targetActivity;
      }
      return item;
    });

    await persistActivities(updated);

    // Sync to Supabase
    if (targetActivity && isSupabaseConfigured()) {
      supabaseActivityService.upsertActivity(targetActivity).catch((err) => {
        console.warn('Failed to update activity in Supabase:', err);
      });
    }
  };

  const deleteActivity = async (id: string) => {
    const updated = activities.filter((item) => item.id !== id);
    await persistActivities(updated);

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      supabaseActivityService.deleteActivity(id).catch((err) => {
        console.warn('Failed to delete activity in Supabase:', err);
      });
    }
  };

  const toggleCompleteActivity = async (id: string) => {
    let targetActivity: Activity | undefined;
    const updated = activities.map((item) => {
      if (item.id === id) {
        const nextStatus: ActivityStatus = item.status === 'completed' ? 'pending' : 'completed';
        targetActivity = {
          ...item,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
        return targetActivity;
      }
      return item;
    });

    await persistActivities(updated);

    // Sync to Supabase
    if (targetActivity && isSupabaseConfigured()) {
      supabaseActivityService.upsertActivity(targetActivity).catch((err) => {
        console.warn('Failed to sync completion status to Supabase:', err);
      });
    }
  };

  const getActivityById = (id: string): Activity | undefined => {
    return activities.find((item) => item.id === id);
  };

  const getActivitiesByDate = (date: string): Activity[] => {
    return activities
      .filter((item) => item.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const refreshActivities = async () => {
    if (isSupabaseConfigured()) {
      const remote = await supabaseActivityService.fetchActivities();
      if (remote) {
        setActivities(remote);
        await storage.saveActivities(remote);
        return;
      }
    }
    const saved = await storage.loadActivities();
    if (saved) setActivities(saved);
  };

  const metrics: DashboardMetrics = useMemo(() => {
    const today = getTodayDateString();
    const totalActivities = activities.length;
    const completedActivities = activities.filter((a) => a.status === 'completed').length;
    const pendingActivities = activities.filter((a) => a.status === 'pending').length;
    const inProgressActivities = activities.filter((a) => a.status === 'in_progress').length;

    const todayActivities = activities.filter((a) => a.date === today);
    const todayTotal = todayActivities.length;
    const todayCompleted = todayActivities.filter((a) => a.status === 'completed').length;

    const urgentCount = activities.filter(
      (a) => a.priority === 'urgent' && a.status !== 'completed'
    ).length;

    const completionRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    return {
      totalActivities,
      completedActivities,
      pendingActivities,
      inProgressActivities,
      completionRate,
      todayTotal,
      todayCompleted,
      urgentCount,
    };
  }, [activities]);

  return (
    <ActivityContext.Provider
      value={{
        activities,
        isLoading,
        isCloudSyncing,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleCompleteActivity,
        getActivityById,
        getActivitiesByDate,
        metrics,
        refreshActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
};
