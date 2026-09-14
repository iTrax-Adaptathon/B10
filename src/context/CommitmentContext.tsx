import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Commitment, CommitmentFormData } from '../types/commitment';
import { storage } from '../utils/storage';
import { supabaseCommitmentService } from '../services/supabaseCommitmentService';
import { isSupabaseConfigured } from '../services/supabaseConfig';

interface CommitmentContextType {
  commitments: Commitment[];
  isLoading: boolean;
  isCloudSyncing: boolean;
  addCommitment: (data: CommitmentFormData) => Promise<Commitment>;
  deleteCommitment: (id: string) => Promise<void>;
  refreshCommitments: () => Promise<void>;
}

const CommitmentContext = createContext<CommitmentContextType | undefined>(undefined);

export const CommitmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const saved = await storage.loadCommitments();
      setCommitments(saved ?? []);
      setIsLoading(false);

      if (isSupabaseConfigured()) {
        try {
          setIsCloudSyncing(true);
          const remoteCommitments = await supabaseCommitmentService.fetchCommitments();
          if (remoteCommitments && remoteCommitments.length > 0) {
            setCommitments(remoteCommitments);
            await storage.saveCommitments(remoteCommitments);
          } else if (saved && saved.length > 0) {
            for (const item of saved) {
              await supabaseCommitmentService.upsertCommitment(item);
            }
          }
        } catch (err) {
          console.warn('Background Supabase commitment sync notice:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    };

    load();
  }, []);

  const persist = async (nextList: Commitment[]) => {
    setCommitments(nextList);
    await storage.saveCommitments(nextList);
  };

  const addCommitment = async (data: CommitmentFormData): Promise<Commitment> => {
    const now = new Date().toISOString();
    const nextCommitment: Commitment = {
      id: `commit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [nextCommitment, ...commitments];
    await persist(updated);

    if (isSupabaseConfigured()) {
      supabaseCommitmentService.upsertCommitment(nextCommitment).catch((err) => {
        console.warn('Failed to push commitment to Supabase:', err);
      });
    }

    return nextCommitment;
  };

  const deleteCommitment = async (id: string) => {
    const updated = commitments.filter((item) => item.id !== id);
    await persist(updated);

    if (isSupabaseConfigured()) {
      supabaseCommitmentService.deleteCommitment(id).catch((err) => {
        console.warn('Failed to delete commitment in Supabase:', err);
      });
    }
  };

  const refreshCommitments = async () => {
    if (isSupabaseConfigured()) {
      const remote = await supabaseCommitmentService.fetchCommitments();
      if (remote) {
        setCommitments(remote);
        await storage.saveCommitments(remote);
        return;
      }
    }
    const saved = await storage.loadCommitments();
    setCommitments(saved ?? []);
  };

  const value = useMemo<CommitmentContextType>(
    () => ({
      commitments,
      isLoading,
      isCloudSyncing,
      addCommitment,
      deleteCommitment,
      refreshCommitments,
    }),
    [commitments, isLoading, isCloudSyncing],
  );

  return <CommitmentContext.Provider value={value}>{children}</CommitmentContext.Provider>;
};

export const useCommitments = (): CommitmentContextType => {
  const context = useContext(CommitmentContext);
  if (!context) {
    throw new Error('useCommitments must be used within a CommitmentProvider');
  }
  return context;
};
