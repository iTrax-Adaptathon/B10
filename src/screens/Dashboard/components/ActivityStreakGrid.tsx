import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Activity, ActivityCategory } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { getTodayDateString } from '../../../utils/dateHelpers';

interface ActivityStreakGridProps {
  activities: Activity[];
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}

interface StreakDay {
  date: string;
  count: number;
  dayLabel: string;
}

const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStreakDays = (activities: Activity[], selectedCategory: ActivityCategory): StreakDay[] => {
  const activityCounts = activities
    .filter((activity) => activity.category === selectedCategory)
    .reduce<Record<string, number>>((counts, activity) => {
    counts[activity.date] = (counts[activity.date] || 0) + 1;
    return counts;
    }, {});
  const today = new Date();
  const days: StreakDay[] = [];

  for (let offset = 41; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    days.push({
      date: getDateString(date),
      count: activityCounts[getDateString(date)] || 0,
      dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
    });
  }

  return days;
};

type CellLevel = 'levelEmpty' | 'levelOne' | 'levelTwo' | 'levelThree';

const getLevel = (count: number): CellLevel => {
  if (count === 0) return 'levelEmpty';
  if (count === 1) return 'levelOne';
  if (count === 2) return 'levelTwo';
  return 'levelThree';
};

export const ActivityStreakGrid: React.FC<ActivityStreakGridProps> = ({
  activities,
  onGestureStart,
  onGestureEnd,
}) => {
  const activityTypes = useMemo(
    () => Array.from(new Set(activities.map((activity) => activity.category))),
    [activities],
  );
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>(activityTypes[0] || 'other');
  const selectedActivities = activities.filter((activity) => activity.category === selectedCategory);
  const days = useMemo(() => getStreakDays(activities, selectedCategory), [activities, selectedCategory]);
  const today = getTodayDateString();
  const todayCount = days[days.length - 1]?.count || 0;
  const totalLogged = days.reduce((total, day) => total + day.count, 0);

  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0 && days[index].count > 0; index -= 1) {
    currentStreak += 1;
  }

  const weeks = Array.from({ length: 6 }, (_, weekIndex) => days.slice(weekIndex * 7, weekIndex * 7 + 7));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{selectedCategory[0].toUpperCase() + selectedCategory.slice(1)} streak</Text>
          <Text style={styles.subtitle}>Your consistency over the last 6 weeks</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakValue}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      <Text style={styles.selectLabel}>Track an activity type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activityTypesRow}
        nestedScrollEnabled
        directionalLockEnabled
        onTouchStart={onGestureStart}
        onTouchEnd={onGestureEnd}
        onTouchCancel={onGestureEnd}
      >
        {activityTypes.map((category) => (
          <TouchableOpacity
            key={category}
            activeOpacity={0.8}
            onPress={() => setSelectedCategory(category)}
            style={[styles.activityTypeChip, category === selectedCategory && styles.activityTypeChipActive]}
          >
            <Text style={[styles.activityTypeText, category === selectedCategory && styles.activityTypeTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          <Text style={styles.summaryStrong}>{totalLogged}</Text> activities logged
        </Text>
        <Text style={styles.summaryText}>
          Today: <Text style={styles.summaryStrong}>{todayCount}</Text> {selectedActivities.length === 1 ? 'activity' : 'activities'}
        </Text>
      </View>

      <View style={styles.gridShell}>
        <View style={styles.dayLabels}>
          {['M', '', 'W', '', 'F', '', 'S'].map((label, index) => (
            <Text key={`${label}-${index}`} style={styles.dayLabel}>{label}</Text>
          ))}
        </View>
        <View style={styles.weeksRow}>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekColumn}>
              {week.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  activeOpacity={0.75}
                  style={[styles.cell, styles[getLevel(day.count)], day.date === today && styles.todayCell]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Less</Text>
        <View style={[styles.legendCell, styles.levelEmpty]} />
        <View style={[styles.legendCell, styles.levelOne]} />
        <View style={[styles.legendCell, styles.levelTwo]} />
        <View style={[styles.legendCell, styles.levelThree]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    ...spacing.neu.raisedSm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  selectLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  activityTypesRow: {
    gap: spacing.xs,
    paddingVertical: 2,
  },
  activityTypeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.surfaceInset,
  },
  activityTypeChipActive: {
    backgroundColor: colors.primary,
  },
  activityTypeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: 'capitalize',
  },
  activityTypeTextActive: {
    color: colors.textInverse,
  },
  streakBadge: {
    alignItems: 'flex-end',
  },
  streakValue: {
    color: colors.success,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  streakLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: -2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  summaryText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  summaryStrong: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  gridShell: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  dayLabels: {
    width: 16,
    justifyContent: 'space-between',
    paddingVertical: 1,
    marginRight: 6,
  },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 9,
    height: 12,
    lineHeight: 12,
  },
  weeksRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekColumn: {
    gap: 4,
  },
  cell: {
    width: 15,
    height: 15,
    borderRadius: 3,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  levelEmpty: {
    backgroundColor: colors.surfaceInset,
  },
  levelOne: {
    backgroundColor: '#B7D9C1',
  },
  levelTwo: {
    backgroundColor: '#62A97A',
  },
  levelThree: {
    backgroundColor: colors.success,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: spacing.sm,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 9,
  },
  legendCell: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
});
