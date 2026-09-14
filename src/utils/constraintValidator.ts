import { Activity } from '../types/activity';
import { Commitment } from '../types/commitment';
import { getCommitmentWindowsForDate, isRangeOverlap, timeToMinutes } from './availabilityCalculator';

export interface ConstraintIssue {
  code: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ConstraintValidationResult {
  valid: boolean;
  issues: ConstraintIssue[];
  suggestedSlots?: string[];
}

const clampMinutes = (value: number): number => Math.max(0, Math.min(value, 24 * 60));

export const validateActivityConstraints = (
  activity: Activity,
  existingActivities: Activity[],
  commitments: Commitment[],
): ConstraintValidationResult => {
  const issues: ConstraintIssue[] = [];
  const startMinutes = timeToMinutes(activity.startTime);
  const endMinutes = timeToMinutes(activity.endTime);
  const durationMinutes = typeof activity.duration === 'number' ? activity.duration : Math.max(0, endMinutes - startMinutes);

  if (!activity.title.trim()) {
    issues.push({ code: 'REQUIRED', field: 'title', message: 'Activity title is required.', severity: 'error' });
  }

  if (startMinutes < 0 || endMinutes < 0 || startMinutes >= endMinutes) {
    issues.push({ code: 'VALID_TIME', field: 'time', message: 'End time must be after start time.', severity: 'error' });
  }

  if (durationMinutes <= 0) {
    issues.push({ code: 'DURATION', field: 'duration', message: 'Duration must be greater than zero minutes.', severity: 'error' });
  }

  if (activity.deadline) {
    const deadlineValue = new Date(activity.deadline);
    const activityEnd = new Date(`${activity.date}T${activity.endTime}:00`);
    if (Number.isNaN(deadlineValue.getTime()) || Number.isNaN(activityEnd.getTime()) || activityEnd > deadlineValue) {
      issues.push({ code: 'DEADLINE', field: 'deadline', message: 'Activity must complete before its deadline.', severity: 'error' });
    }
  }

  if (activity.dependencies && activity.dependencies.length > 0) {
    for (const dependencyId of activity.dependencies) {
      const dependency = existingActivities.find((item) => item.id === dependencyId);
      if (!dependency) {
        issues.push({ code: 'DEPENDENCY', field: 'dependencies', message: 'A selected dependency no longer exists.', severity: 'error' });
      }
    }
  }

  const dailyCommitments = getCommitmentWindowsForDate(activity.date, commitments);
  for (const commitment of dailyCommitments) {
    if (isRangeOverlap(startMinutes, endMinutes, commitment.startMinutes, commitment.endMinutes)) {
      issues.push({
        code: 'COMMITMENT',
        field: 'time',
        message: `Cannot schedule this activity during ${commitment.start} - ${commitment.end}.`,
        severity: 'error',
      });
    }
  }

  for (const existing of existingActivities) {
    if (existing.id === activity.id || existing.date !== activity.date) {
      continue;
    }

    const existingStart = timeToMinutes(existing.startTime);
    const existingEnd = timeToMinutes(existing.endTime);
    if (existingStart < 0 || existingEnd < 0) {
      continue;
    }

    if (isRangeOverlap(startMinutes, endMinutes, existingStart, existingEnd)) {
      issues.push({
        code: 'OVERLAP',
        field: 'time',
        message: `Time conflict with ${existing.title} (${existing.startTime} - ${existing.endTime}).`,
        severity: 'error',
      });
    }
  }

  const availabilityWindows = dailyCommitments.length > 0
    ? []
    : [{ startMinutes: 0, endMinutes: 24 * 60 }];

  if (dailyCommitments.length > 0) {
    let cursor = 0;
    for (const commitment of dailyCommitments) {
      if (commitment.startMinutes > cursor) {
        if (commitment.startMinutes - cursor >= durationMinutes) {
          availabilityWindows.push({ startMinutes: cursor, endMinutes: commitment.startMinutes });
        }
      }
      cursor = Math.max(cursor, commitment.endMinutes);
    }
    if (24 * 60 - cursor >= durationMinutes) {
      availabilityWindows.push({ startMinutes: cursor, endMinutes: 24 * 60 });
    }
  }

  const fitsAvailability = availabilityWindows.some(
    (window) => durationMinutes <= window.endMinutes - window.startMinutes
      && startMinutes >= window.startMinutes
      && endMinutes <= window.endMinutes,
  );

  if (!fitsAvailability && startMinutes >= 0 && endMinutes >= 0 && durationMinutes > 0) {
    issues.push({
      code: 'AVAILABILITY',
      field: 'time',
      message: 'This time falls outside the available time window.',
      severity: 'error',
    });
  }

  if (activity.type === 'fixed') {
    const priorityWindow = activity.fixedStartTime && activity.fixedEndTime
      ? { start: timeToMinutes(activity.fixedStartTime), end: timeToMinutes(activity.fixedEndTime) }
      : null;

    if (priorityWindow && priorityWindow.start >= priorityWindow.end) {
      issues.push({ code: 'FIXED_TIME', field: 'fixedStartTime', message: 'Fixed activities must have a valid time range.', severity: 'error' });
    }
  }

  if (activity.preferredStartTime && activity.preferredEndTime) {
    const preferredStart = timeToMinutes(activity.preferredStartTime);
    const preferredEnd = timeToMinutes(activity.preferredEndTime);
    if (preferredStart >= preferredEnd) {
      issues.push({ code: 'PREFERRED_RANGE', field: 'preferredStartTime', message: 'Preferred time range must be valid.', severity: 'warning' });
    }
  }

  const sortedBySeverity = issues.sort((a, b) => {
    const severityValue = { error: 0, warning: 1 };
    return severityValue[a.severity] - severityValue[b.severity];
  });

  return {
    valid: sortedBySeverity.every((issue) => issue.severity !== 'error'),
    issues: sortedBySeverity,
    suggestedSlots: [],
  };
};

export const findAvailableSlots = (
  date: string,
  durationMinutes: number,
  commitments: Commitment[],
  existingActivities: Activity[],
  preferredStart?: string,
  preferredEnd?: string,
): string[] => {
  const blocks = [
    ...getCommitmentWindowsForDate(date, commitments),
    ...existingActivities
      .filter((activity) => activity.date === date)
      .map((activity) => ({
        start: activity.startTime,
        end: activity.endTime,
        startMinutes: timeToMinutes(activity.startTime),
        endMinutes: timeToMinutes(activity.endTime),
      })),
  ].filter((block) => block.startMinutes >= 0 && block.endMinutes >= 0);

  const sorted = blocks.sort((a, b) => a.startMinutes - b.startMinutes);
  const windows: { startMinutes: number; endMinutes: number }[] = [];
  let cursor = 0;

  for (const block of sorted) {
    if (block.startMinutes > cursor && block.startMinutes - cursor >= durationMinutes) {
      windows.push({ startMinutes: cursor, endMinutes: block.startMinutes });
    }
    cursor = Math.max(cursor, block.endMinutes);
  }

  if (24 * 60 - cursor >= durationMinutes) {
    windows.push({ startMinutes: cursor, endMinutes: 24 * 60 });
  }

  const preferred = preferredStart && preferredEnd
    ? { startMinutes: timeToMinutes(preferredStart), endMinutes: timeToMinutes(preferredEnd) }
    : null;

  const ranked = [...windows].sort((a, b) => {
    const aDistance = preferred
      ? Math.abs((a.startMinutes + a.endMinutes) / 2 - ((preferred.startMinutes + preferred.endMinutes) / 2))
      : Number.MAX_SAFE_INTEGER;
    const bDistance = preferred
      ? Math.abs((b.startMinutes + b.endMinutes) / 2 - ((preferred.startMinutes + preferred.endMinutes) / 2))
      : Number.MAX_SAFE_INTEGER;
    return aDistance - bDistance;
  });

  return ranked.map((window) => `${clampMinutes(window.startMinutes)}-${clampMinutes(window.endMinutes)}`);
};
