import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { useActivities } from '../../../context/ActivityContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { formatDuration, formatTime12h } from '../../../utils/dateHelpers';

interface TodayActivitiesCarouselProps {
  activities: Activity[];
  dateLabel?: string;
  toggleCompleteActivity?: (id: string) => void;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}

const screenWidth = Dimensions.get('window').width;
const itemWidth = Math.min(270, screenWidth * 0.72);

const getDayDescription = (count: number) => {
  if (count === 0) {
    return {
      title: 'Chill Day',
      message: 'No activities scheduled for today. Enjoy the space to rest or explore something new.',
    };
  }

  if (count >= 5) {
    return {
      title: 'Hectic Day',
      message: 'A packed schedule ahead. Take it one activity at a time and stay hydrated!',
    };
  }

  if (count >= 3) {
    return {
      title: 'Balanced Day',
      message: 'A steady mix of activities. You have room to make solid progress.',
    };
  }

  return {
    title: 'Light Day',
    message: 'A few meaningful goals to focus on today, with plenty of breathing room.',
  };
};

export const TodayActivitiesCarousel: React.FC<TodayActivitiesCarouselProps> = ({
  activities,
  dateLabel = 'Today',
  toggleCompleteActivity: externalToggle,
  onGestureStart,
  onGestureEnd,
}) => {
  const { toggleCompleteActivity: contextToggle } = useActivities();
  const toggleComplete = externalToggle || contextToggle;

  const carouselRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const lineProgress = useRef(new Animated.Value(0)).current;
  const livePulse = useRef(new Animated.Value(0)).current;

  const dayDescription = useMemo(() => getDayDescription(activities.length), [activities.length]);

  const currentTaskId = useMemo(() => {
    return (
      activities.find((activity) => activity.status === 'in_progress')?.id ||
      activities.find((activity) => activity.status !== 'completed')?.id ||
      activities[0]?.id
    );
  }, [activities]);

  const focusLiveTask = () => {
    const liveIndex = activities.findIndex((activity) => activity.id === currentTaskId);
    if (liveIndex < 0) return;

    const offset = liveIndex * itemWidth;
    carouselRef.current?.scrollTo({ x: offset, animated: true });
    scrollX.setValue(offset);
  };

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(lineProgress, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(lineProgress, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [lineProgress]);

  useEffect(() => {
    livePulse.setValue(0);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(livePulse, { toValue: 0, duration: 650, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [livePulse, currentTaskId]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's activity flow</Text>
          <View style={styles.headerRight}>
            <Text style={styles.count}>
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </Text>
            {activities.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.currentTaskButton}
                onPress={focusLiveTask}
              >
                <Text style={styles.currentTaskButtonText}>Current task</Text>
              </TouchableOpacity>
            )}
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{dateLabel}</Text>
            </View>
          </View>
        </View>

        {activities.length > 0 ? (
          <Animated.ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={itemWidth}
            decelerationRate="fast"
            bounces={false}
            nestedScrollEnabled
            directionalLockEnabled
            scrollEventThrottle={16}
            contentContainerStyle={styles.row}
            onTouchStart={onGestureStart}
            onTouchEnd={onGestureEnd}
            onTouchCancel={onGestureEnd}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true },
            )}
          >
            {activities.map((activity, index) => {
              const isCompleted = activity.status === 'completed';
              const isLive = activity.id === currentTaskId && !isCompleted;

              const opacity = scrollX.interpolate({
                inputRange: [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              const scale = scrollX.interpolate({
                inputRange: [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
                outputRange: [0.92, 1, 0.92],
                extrapolate: 'clamp',
              });

              const accentColor = activity.tagColor || colors.primary;

              return (
                <Animated.View
                  key={activity.id}
                  style={[styles.card, { opacity, transform: [{ scale }] }]}
                >
                  <View style={styles.touchable}>
                    <View style={styles.nodeTrack}>
                      <Animated.View
                        style={[
                          styles.bubbleFrame,
                          isLive && {
                            transform: [
                              {
                                scale: livePulse.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 1.08],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        {isLive && (
                          <Animated.View
                            style={[
                              styles.liveRing,
                              {
                                borderColor: colors.success,
                                opacity: livePulse.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 0],
                                }),
                                transform: [
                                  {
                                    scale: livePulse.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [1, 1.4],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.bubble,
                            { borderColor: accentColor },
                            isCompleted && styles.bubbleCompleted,
                          ]}
                        >
                          <Text style={[styles.bubbleText, { color: accentColor }]}>
                            {activity.title.slice(0, 2).toUpperCase()}
                          </Text>
                          <View style={styles.statusIcon}>
                            {isCompleted ? (
                              <CheckCircle2 size={17} color={colors.success} />
                            ) : (
                              <Circle size={17} color={accentColor} />
                            )}
                          </View>
                        </View>
                      </Animated.View>

                      {index < activities.length - 1 && (
                        <View style={styles.connector}>
                          <Animated.View
                            style={[
                              styles.connectorHighlight,
                              {
                                transform: [
                                  {
                                    translateX: lineProgress.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [-26, itemWidth - 82],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.detailsBlock}>
                      <Text
                        style={[styles.cardTitle, isCompleted && styles.completedText]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
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
                        onPress={() => toggleComplete(activity.id)}
                      >
                        <CheckCircle2
                          size={13}
                          color={isCompleted ? colors.success : colors.textInverse}
                        />
                        <Text
                          style={[
                            styles.completeButtonText,
                            isCompleted && styles.completeButtonTextDone,
                          ]}
                        >
                          {isCompleted ? 'Completed' : 'Complete'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        ) : (
          <Text style={styles.emptyText}>No activities planned for today.</Text>
        )}
      </View>
      <View style={styles.dayDescription}>
        <Text style={styles.dayDescriptionTitle}>{dayDescription.title}</Text>
        <Text style={styles.dayDescriptionText}>“{dayDescription.message}”</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentTaskButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.successMuted,
  },
  currentTaskButtonText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: typography.weights.bold,
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
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
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
    maxWidth: itemWidth,
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
    paddingHorizontal: Math.max(0, (screenWidth - itemWidth - spacing.md * 2) / 2),
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
    overflow: 'hidden',
  },
  nodeTrack: {
    width: itemWidth,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubble: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  bubbleFrame: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveRing: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
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
    right: 1,
    bottom: 1,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.full,
  },
  connector: {
    position: 'absolute',
    top: 41,
    left: itemWidth / 2 + 41,
    width: itemWidth - 82,
    height: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  connectorHighlight: {
    width: 26,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
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
    flexShrink: 1,
    overflow: 'hidden',
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
    width: '100%',
    paddingHorizontal: spacing.xs,
    overflow: 'hidden',
  },
  detailText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    flexShrink: 1,
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
    ...spacing.neu.glow(colors.primary),
  },
  completeButtonDone: {
    backgroundColor: colors.successMuted,
  },
  completeButtonText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  completeButtonTextDone: {
    color: colors.success,
  },
});
