import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle2, Circle, Clock, MapPin } from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { RootStackParamList } from '../../../types/navigation';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { formatTime12h, formatDuration } from '../../../utils/dateHelpers';

interface TodayScheduleTimelineProps {
  activities: Activity[];
  onToggleComplete: (id: string) => void;
}

export const TodayScheduleTimeline: React.FC<TodayScheduleTimelineProps> = ({
  activities,
  onToggleComplete,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Clock size={28} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No scheduled tasks for this day</Text>
        <Text style={styles.emptySub}>Swipe right or tap 'Add' to schedule an activity!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.map((item, index) => {
        const isLast = index === activities.length - 1;
        const isCompleted = item.status === 'completed';

        return (
          <View key={item.id} style={styles.timelineRow}>
            {/* Left time column */}
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{formatTime12h(item.startTime)}</Text>
              <Text style={styles.durationText}>{formatDuration(item.startTime, item.endTime)}</Text>
            </View>

            {/* Middle line and node */}
            <View style={styles.nodeColumn}>
              <TouchableOpacity
                onPress={() => onToggleComplete(item.id)}
                activeOpacity={0.7}
                style={[
                  styles.nodeIconWrapper,
                  isCompleted ? styles.nodeCompleted : styles.nodePending,
                ]}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} color={colors.success} />
                ) : (
                  <Circle size={14} color={item.tagColor || colors.secondary} />
                )}
              </TouchableOpacity>
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Right content card */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.card,
                isCompleted && styles.cardCompleted,
                { borderLeftColor: item.tagColor || colors.secondary },
              ]}
              onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[styles.cardTitle, isCompleted && styles.titleCompleted]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: (colors.priorities[item.priority] || colors.primary) + '22' },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: colors.priorities[item.priority] || colors.secondary },
                    ]}
                  >
                    {item.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              {item.description ? (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}

              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: (colors.categories[item.category] || colors.primary) + '22' },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.categories[item.category] || colors.secondary },
                    ]}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                </View>

                {item.location ? (
                  <View style={styles.locationContainer}>
                    <MapPin size={12} color={colors.textMuted} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
    ...spacing.neu.raisedSm,
  },
  emptyIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    backgroundColor: colors.surfaceInset,
    ...spacing.neu.recessed,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  timeColumn: {
    width: 68,
    alignItems: 'flex-end',
    paddingRight: spacing.xs,
    paddingTop: 6,
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  durationText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  nodeColumn: {
    width: 26,
    alignItems: 'center',
    paddingTop: 4,
  },
  nodeIconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.borderRadius.full,
    zIndex: 2,
    backgroundColor: colors.surfaceElevated,
    ...spacing.neu.raisedSm,
  },
  nodePending: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  nodeCompleted: {
    borderColor: colors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.sm,
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
    ...spacing.neu.raisedSm,
    borderLeftWidth: 4,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: colors.surfaceInset,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginRight: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.xs,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    marginBottom: 6,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.xs,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
