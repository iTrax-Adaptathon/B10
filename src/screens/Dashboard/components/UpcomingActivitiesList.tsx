import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, ChevronRight, Clock } from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { RootStackParamList } from '../../../types/navigation';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { formatDateDisplay, formatTime12h } from '../../../utils/dateHelpers';

interface UpcomingActivitiesListProps {
  activities: Activity[];
}

export const UpcomingActivitiesList: React.FC<UpcomingActivitiesListProps> = ({ activities }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Calendar size={28} color={colors.textMuted} />
        <Text style={styles.emptyText}>No urgent tasks pending</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          activeOpacity={0.75}
          style={styles.item}
          onPress={() => navigation.navigate('ActivityDetail', { activity })}
        >
          <View style={[styles.indicator, { backgroundColor: activity.tagColor || colors.secondary }]} />
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {activity.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Calendar size={11} color={colors.textMuted} />
                <Text style={styles.metaText}>{formatDateDisplay(activity.date)}</Text>
              </View>
              <View style={styles.badge}>
                <Clock size={11} color={colors.textMuted} />
                <Text style={styles.metaText}>{formatTime12h(activity.startTime)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: (colors.priorities[activity.priority] || colors.primary) + '25' },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: colors.priorities[activity.priority] || colors.secondary },
                ]}
              >
                {activity.priority}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  emptyContainer: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.raisedSm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.sm + 2,
    ...spacing.neu.raisedSm,
  },
  indicator: {
    width: 4,
    height: 38,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.xs,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'capitalize',
  },
});
