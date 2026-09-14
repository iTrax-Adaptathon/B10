import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Activity } from '../types/activity';

export interface DbActivityRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  tag_color: string | null;
  has_reminder: boolean | null;
  reminder_minutes_before: number | null;
  location: string | null;
  type: string | null;
  duration: number | null;
  fixed_start_time: string | null;
  fixed_end_time: string | null;
  dependencies: string[] | null;
  resources: string[] | null;
  created_at: string;
  updated_at: string;
}

export const mapRowToActivity = (row: DbActivityRow): Activity => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  category: row.category as any,
  priority: row.priority as any,
  status: (row.status || 'pending') as any,
  date: row.date,
  startTime: row.start_time,
  endTime: row.end_time,
  tagColor: row.tag_color || '#4F46E5',
  hasReminder: Boolean(row.has_reminder),
  reminderMinutesBefore: row.reminder_minutes_before || undefined,
  location: row.location || undefined,
  type: (row.type as any) || 'fixed',
  duration: row.duration || undefined,
  fixedStartTime: row.fixed_start_time || undefined,
  fixedEndTime: row.fixed_end_time || undefined,
  dependencies: row.dependencies || [],
  resources: row.resources || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapActivityToRow = (activity: Activity): DbActivityRow => ({
  id: activity.id,
  title: activity.title,
  description: activity.description || null,
  category: activity.category,
  priority: activity.priority,
  status: activity.status,
  date: activity.date,
  start_time: activity.startTime,
  end_time: activity.endTime,
  tag_color: activity.tagColor || null,
  has_reminder: activity.hasReminder,
  reminder_minutes_before: activity.reminderMinutesBefore || null,
  location: activity.location || null,
  type: activity.type || 'fixed',
  duration: activity.duration || null,
  fixed_start_time: activity.fixedStartTime || null,
  fixed_end_time: activity.fixedEndTime || null,
  dependencies: activity.dependencies || null,
  resources: activity.resources || null,
  created_at: activity.createdAt,
  updated_at: activity.updatedAt,
});

export const supabaseActivityService = {
  async fetchActivities(): Promise<Activity[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.warn('Supabase fetchActivities error:', error.message);
        return null;
      }
      return (data as DbActivityRow[]).map(mapRowToActivity);
    } catch (err) {
      console.warn('Failed to fetch activities from Supabase:', err);
      return null;
    }
  },

  async upsertActivity(activity: Activity): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const row = mapActivityToRow(activity);
      const { error } = await supabase.from('activities').upsert(row);
      if (error) {
        console.warn('Supabase upsertActivity error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Failed to upsert activity to Supabase:', err);
      return false;
    }
  },

  async deleteActivity(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) {
        console.warn('Supabase deleteActivity error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Failed to delete activity from Supabase:', err);
      return false;
    }
  },
};
