import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { formatDuration, formatTime12h, getTodayDateString } from '../../../utils/dateHelpers';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = Math.min(220, screenWidth * 0.58);

interface TodayActivitiesCarouselProps {
  activities: Activity[];
  toggleCompleteActivity: (id: string) => void;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}

const getDailyHighlight = (activities: Activity[]) => {
  const completed = activities.filter((a) => a.status === 'completed').length;
  const pending = activities.length - completed;

  if (activities.length === 0) {
    return {
      title: 'Free Schedule Ahead',
      message: 'No activities scheduled for today. Ready for new goals!',
    };
  }

  if (pending === 0) {
    return {
      title: 'All Goals Completed! 🎉',
      message: 'Outstanding work! You have finished all scheduled activities today.',
    };
  }

  return {
    title: `${pending} Task${pending > 1 ? 's' : ''} Remaining`,
    message: `${completed} of ${activities.length} tasks completed today. Keep the momentum going!`,
  };
};

export const TodayActivitiesCarousel: React.FC<TodayActivitiesCarouselProps> = ({
  activities,
  toggleCompleteActivity,
  onGestureStart,
  onGestureEnd,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const today = getTodayDateString();
  const dayDescription = useMemo(() => getDailyHighlight(activities), [activities]);

  const currentTaskIndex = useMemo(() => {
    const pendingIndex = activities.findIndex((a) => a.status !== 'completed');
    return pendingIndex >= 0 ? pendingIndex : 0;
  }, [activities]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Focus Carousel</Text>
          <Text style={styles.count}>{activities.length} scheduled today</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>TODAY</Text>
          </View>
        </View>
      </View>

      {activities.length > 0 ? (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          snapToInterval={itemWidth}
          decelerationRate="fast"
          nestedScrollEnabled
          directionalLockEnabled
          onTouchStart={onGestureStart}
          onTouchEnd={onGestureEnd}
          onTouchCancel={onGestureEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
        >
          {activities.map((activity, index) => {
            const isCompleted = activity.status === 'completed';
            const isCurrent = index === currentTaskIndex && !isCompleted;

            return (
              <View key={activity.id} style={styles.card}>
                <View style={styles.touchable}>
                  <View style={styles.nodeTrack}>
                    <View style={styles.bubbleFrame}>
                      {isCurrent && <View style={styles.liveRing} />}
                      <View
                        style={[
                          styles.bubble,
                          isCompleted && styles.bubbleCompleted,
                          { borderColor: activity.tagColor || colors.primary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            { color: activity.tagColor || colors.primary },
                          ]}
                        >
                          {activity.title.slice(0, 2).toUpperCase()}
                        </Text>
                        <View style={styles.statusIcon}>
                          {isCompleted ? (
                            <CheckCircle2 size={18} color={colors.success} />
                          ) : (
                            <Circle size={18} color={activity.tagColor || colors.primary} />
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsBlock}>
                    <Text
                      style={[styles.cardTitle, isCompleted && styles.completedText]}
                      numberOfLines={2}
                    >
                      {activity.title}
                    </Text>
                    <View style={styles.detailsRow}>
                      <Clock3 size={13} color={colors.textMuted} />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {formatTime12h(activity.startTime)}
                      </Text>
                      <Text style={styles.detailDivider}>•</Text>
                      <Text style={styles.detailText} numberOfLines={1}>
                        {formatDuration(activity.startTime, activity.endTime)}
                      </Text>
                    </View>
                    <Text style={styles.categoryText} numberOfLines={1}>
                      {activity.category}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.completeButton, isCompleted && styles.completeButtonDone]}
                      onPress={() => toggleCompleteActivity(activity.id)}
                    >
                      <CheckCircle2
                        size={13}
                        color={isCompleted ? colors.success : '#FFFFFF'}
                      />
                      <Text
                        style={[
                          styles.completeButtonText,
                          isCompleted && styles.completeButtonTextDone,
                        ]}
                      >
                        {isCompleted ? 'Completed' : 'Mark Done'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>
      ) : (
        <Text style={styles.emptyText}>No activities planned for today.</Text>
      )}

      <View style={styles.dayDescription}>
        <Text style={styles.dayDescriptionTitle}>{dayDescription.title}</Text>
        <Text style={styles.dayDescriptionText}>“{dayDescription.message}”</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  count: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  todayBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.primaryMuted,
  },
  todayBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  dayDescription: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  dayDescriptionTitle: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  dayDescriptionText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    lineHeight: 19,
    marginTop: spacing.xs,
    textAlign: 'center',
    maxWidth: itemWidth * 1.5,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  card: {
    width: itemWidth,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
  },
  detailsBlock: {
    width: itemWidth - spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  nodeTrack: {
    width: itemWidth,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubble: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  bubbleFrame: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2.5,
    borderColor: colors.success,
  },
  bubbleCompleted: {
    opacity: 0.65,
  },
  bubbleText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  statusIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceElevated,
    borderRadius: spacing.borderRadius.full,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
    lineHeight: 18,
    textAlign: 'center',
    width: '100%',
    minHeight: 36,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 3,
  },
  detailText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  detailDivider: {
    color: colors.border,
    fontSize: typography.sizes.xs,
  },
  categoryText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.primary,
  },
  completeButtonDone: {
    backgroundColor: colors.successMuted,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  completeButtonTextDone: {
    color: colors.success,
  },
});
