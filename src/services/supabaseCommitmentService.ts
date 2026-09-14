import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Commitment } from '../types/commitment';

export interface DbCommitmentRow {
  id: string;
  title: string;
  days: number[];
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export const mapRowToCommitment = (row: DbCommitmentRow): Commitment => ({
  id: row.id,
  title: row.title,
  days: row.days || [],
  startTime: row.start_time,
  endTime: row.end_time,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCommitmentToRow = (commitment: Commitment): DbCommitmentRow => ({
  id: commitment.id,
  title: commitment.title,
  days: commitment.days,
  start_time: commitment.startTime,
  end_time: commitment.endTime,
  created_at: commitment.createdAt,
  updated_at: commitment.updatedAt,
});

export const supabaseCommitmentService = {
  async fetchCommitments(): Promise<Commitment[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.warn('Supabase fetchCommitments error:', error.message);
        return null;
      }
      return (data as DbCommitmentRow[]).map(mapRowToCommitment);
    } catch (err) {
      console.warn('Failed to fetch commitments from Supabase:', err);
      return null;
    }
  },

  async upsertCommitment(commitment: Commitment): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const row = mapCommitmentToRow(commitment);
      const { error } = await supabase.from('commitments').upsert(row);
      if (error) {
        console.warn('Supabase upsertCommitment error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Failed to upsert commitment to Supabase:', err);
      return false;
    }
  },

  async deleteCommitment(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('commitments').delete().eq('id', id);
      if (error) {
        console.warn('Supabase deleteCommitment error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Failed to delete commitment from Supabase:', err);
      return false;
    }
  },
};
