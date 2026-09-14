import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Commitment, CommitmentFormData } from '../types/commitment';
import { storage } from '../utils/storage';

interface CommitmentContextType {
  commitments: Commitment[];
  isLoading: boolean;
  addCommitment: (data: CommitmentFormData) => Promise<Commitment>;
  deleteCommitment: (id: string) => Promise<void>;
  refreshCommitments: () => Promise<void>;
}

const CommitmentContext = createContext<CommitmentContextType | undefined>(undefined);

export const CommitmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const saved = await storage.loadCommitments();
      setCommitments(saved ?? []);
      setIsLoading(false);
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
    return nextCommitment;
  };

  const deleteCommitment = async (id: string) => {
    await persist(commitments.filter((item) => item.id !== id));
  };

  const refreshCommitments = async () => {
    const saved = await storage.loadCommitments();
    setCommitments(saved ?? []);
  };

  const value = useMemo<CommitmentContextType>(
    () => ({
      commitments,
      isLoading,
      addCommitment,
      deleteCommitment,
      refreshCommitments,
    }),
    [commitments, isLoading],
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
