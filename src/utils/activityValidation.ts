import { Activity, ActivityType } from '../types/activity';
import { Commitment } from '../types/commitment';

export interface ActivityValidationError {
  field: string;
  code: string;
  message: string;
}

export interface ActivityValidationResult {
  valid: boolean;
  errors: ActivityValidationError[];
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const getMinutes = (time: string | undefined): number | null => {
  if (!time || !TIME_PATTERN.test(time)) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isValidDate = (date: string): boolean => {
  if (!DATE_PATTERN.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const getActivityType = (activity: Activity): ActivityType => {
  return activity.type || (activity.fixedStartTime || activity.startTime ? 'fixed' : 'flexible');
};

const getFixedStart = (activity: Activity): string | undefined => {
  return activity.fixedStartTime || activity.startTime;
};

const getFixedEnd = (activity: Activity): string | undefined => {
  return activity.fixedEndTime || activity.endTime;
};

export const validateActivity = (
  activity: Activity,
  existingActivities: Activity[],
  commitments: Commitment[] = [],
): ActivityValidationResult => {
  const errors: ActivityValidationError[] = [];
  const type = getActivityType(activity);

  if (!activity.title.trim()) {
    errors.push({ field: 'title', code: 'REQUIRED', message: 'Activity title is required.' });
  }

  if (!isValidDate(activity.date)) {
    errors.push({ field: 'date', code: 'INVALID_DATE', message: 'Enter a valid date in YYYY-MM-DD format.' });
  }

  const duration = typeof activity.duration === 'number' ? activity.duration : (activity.startTime && activity.endTime ? (getMinutes(activity.endTime)! - getMinutes(activity.startTime)!) : 0);

  if (!Number.isFinite(duration) || duration <= 0) {
    errors.push({ field: 'duration', code: 'INVALID_DURATION', message: 'Duration must be greater than zero minutes.' });
  }
  if (type === 'flexible' && duration > 24 * 60) {
    errors.push({ field: 'duration', code: 'DATE_OVERFLOW', message: 'Activity duration must fit within the selected date.' });
  }

  if (type === 'fixed') {
    const start = getMinutes(getFixedStart(activity));
    const end = getMinutes(getFixedEnd(activity));

    if (start === null) {
      errors.push({ field: 'fixedStartTime', code: 'INVALID_TIME', message: 'Enter a valid start time in HH:mm format.' });
    }
    if (end === null) {
      errors.push({ field: 'fixedEndTime', code: 'INVALID_TIME', message: 'Enter a valid end time in HH:mm format.' });
    }
    if (start !== null && end !== null && start >= end) {
      errors.push({ field: 'fixedEndTime', code: 'INVALID_RANGE', message: 'Start time must be before end time.' });
    }

    if (isValidDate(activity.date) && start !== null && end !== null) {
      const conflict = existingActivities.find((existing) => {
        if (existing.id === activity.id || existing.date !== activity.date) return false;
        const existingStart = getMinutes(getFixedStart(existing));
        const existingEnd = getMinutes(getFixedEnd(existing));
        return getActivityType(existing) === 'fixed' && existingStart !== null && existingEnd !== null
          && start < existingEnd && end > existingStart;
      });

      if (conflict) {
        errors.push({
          field: 'fixedStartTime',
          code: 'TIME_CONFLICT',
          message: `Time conflict: ${conflict.title} is already scheduled from ${getFixedStart(conflict)} to ${getFixedEnd(conflict)}.`,
        });
      }
    }
  }

  const dependencies = activity.dependencies || [];
  const existingIds = new Set(existingActivities.map((existing) => existing.id));
  if (dependencies.includes(activity.id)) {
    errors.push({ field: 'dependencies', code: 'SELF_DEPENDENCY', message: 'An activity cannot depend on itself.' });
  }
  if (dependencies.some((dependencyId) => !existingIds.has(dependencyId))) {
    errors.push({ field: 'dependencies', code: 'MISSING_DEPENDENCY', message: 'One or more selected dependencies no longer exist.' });
  }

  const dependencyMap = new Map(existingActivities.map((existing) => [existing.id, existing.dependencies || []]));
  const visits = new Set<string>();
  const stack = [...dependencies];
  while (stack.length > 0) {
    const dependencyId = stack.pop();
    if (!dependencyId || visits.has(dependencyId)) continue;
    visits.add(dependencyId);
    if (dependencyId === activity.id) {
      errors.push({ field: 'dependencies', code: 'CIRCULAR_DEPENDENCY', message: 'Selected dependencies create a circular dependency.' });
      break;
    }
    stack.push(...(dependencyMap.get(dependencyId) || []));
  }

  if (activity.date && activity.startTime && activity.endTime) {
    const activityStart = getMinutes(activity.startTime);
    const activityEnd = getMinutes(activity.endTime);
    if (activityStart !== null && activityEnd !== null) {
      for (const commitment of commitments) {
        const commitmentDay = new Date(`${activity.date}T00:00:00`).getDay();
        const isApplicable = commitment.days.includes(commitmentDay);

        if (!isApplicable) continue;

        const commitmentStart = getMinutes(commitment.startTime);
        const commitmentEnd = getMinutes(commitment.endTime);
        if (commitmentStart !== null && commitmentEnd !== null && activityStart < commitmentEnd && activityEnd > commitmentStart) {
          errors.push({
            field: 'time',
            code: 'COMMITMENT_CONFLICT',
            message: `Cannot schedule this activity during ${commitment.title} (${commitment.startTime} - ${commitment.endTime}).`,
          });
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
};