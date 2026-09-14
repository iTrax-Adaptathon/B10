import { Activity } from '../types/activity';
import { Commitment } from '../types/commitment';

export interface TimeWindow {
  start: string;
  end: string;
  startMinutes: number;
  endMinutes: number;
}

export const timeToMinutes = (value: string): number => {
  if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return -1;
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const getDateDayIndex = (date: string): number => {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? -1 : parsed.getDay();
};

export const isRangeOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean => startA < endB && endA > startB;

export const getCommitmentWindowsForDate = (
  date: string,
  commitments: Commitment[],
): TimeWindow[] => {
  const dayIndex = getDateDayIndex(date);

  return commitments
    .filter((commitment) => commitment.days.includes(dayIndex))
    .map((commitment) => {
      const startMinutes = timeToMinutes(commitment.startTime);
      const endMinutes = timeToMinutes(commitment.endTime);

      if (startMinutes < 0 || endMinutes < 0 || startMinutes >= endMinutes) {
        return null;
      }

      return {
        start: commitment.startTime,
        end: commitment.endTime,
        startMinutes,
        endMinutes,
      };
    })
    .filter((entry): entry is TimeWindow => entry !== null);
};

export const getActivityWindowsForDate = (
  date: string,
  activities: Activity[],
): TimeWindow[] => {
  return activities
    .filter((activity) => activity.date === date)
    .map((activity) => {
      const startMinutes = timeToMinutes(activity.startTime);
      const endMinutes = timeToMinutes(activity.endTime);

      if (startMinutes < 0 || endMinutes < 0 || startMinutes >= endMinutes) {
        return null;
      }

      return {
        start: activity.startTime,
        end: activity.endTime,
        startMinutes,
        endMinutes,
      };
    })
    .filter((entry): entry is TimeWindow => entry !== null);
};

export const calculateAvailableTime = (
  date: string,
  durationMinutes: number,
  commitments: Commitment[],
  activities: Activity[],
): TimeWindow[] => {
  if (!date || durationMinutes <= 0) {
    return [];
  }

  const occupied = [
    ...getCommitmentWindowsForDate(date, commitments),
    ...getActivityWindowsForDate(date, activities),
  ].sort((a, b) => a.startMinutes - b.startMinutes);

  const windows: TimeWindow[] = [];
  let cursor = 0;

  for (const block of occupied) {
    if (block.startMinutes > cursor) {
      const availableStart = cursor;
      const availableEnd = block.startMinutes;
      if (availableEnd - availableStart >= durationMinutes) {
        windows.push({
          start: minutesToTime(availableStart),
          end: minutesToTime(availableEnd),
          startMinutes: availableStart,
          endMinutes: availableEnd,
        });
      }
    }
    cursor = Math.max(cursor, block.endMinutes);
  }

  const finalEnd = 24 * 60;
  if (finalEnd - cursor >= durationMinutes) {
    windows.push({
      start: minutesToTime(cursor),
      end: minutesToTime(finalEnd),
      startMinutes: cursor,
      endMinutes: finalEnd,
    });
  }

  return windows;
};

export const getPreferredWindow = (
  preferredStart?: string,
  preferredEnd?: string,
): { startMinutes: number; endMinutes: number } | null => {
  if (!preferredStart || !preferredEnd) {
    return null;
  }

  const startMinutes = timeToMinutes(preferredStart);
  const endMinutes = timeToMinutes(preferredEnd);

  if (startMinutes < 0 || endMinutes < 0 || startMinutes >= endMinutes) {
    return null;
  }

  return { startMinutes, endMinutes };
};
