export interface Commitment {
  id: string;
  title: string;
  days: number[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitmentFormData {
  title: string;
  days: number[];
  startTime: string;
  endTime: string;
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
