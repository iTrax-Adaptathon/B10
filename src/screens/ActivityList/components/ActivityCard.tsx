import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Calendar,
  Bell,
} from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { formatDateDisplay, formatTime12h, formatDuration } from '../../../utils/dateHelpers';

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onPress: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
  onPress,
}) => {
  const isCompleted = activity.status === 'completed';

  const confirmDelete = () => {
    Alert.alert('Delete Activity', `Are you sure you want to delete "${activity.title}" from PlanWise?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(activity.id) },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        isCompleted && styles.cardCompleted,
        { borderLeftColor: activity.tagColor || colors.secondary },
      ]}
      onPress={() => onPress(activity)}
    >
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleComplete(activity.id)}
          style={styles.checkboxContainer}
        >
          {isCompleted ? (
            <CheckCircle2 size={22} color={colors.success} />
          ) : (
            <Circle size={22} color={colors.textMuted} />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={1}
          >
            {activity.title}
          </Text>
          <View style={styles.badgeRow}>
            {/* Category */}
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: (colors.categories[activity.category] || colors.primary) + '22' },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.categories[activity.category] || colors.secondary },
                ]}
              >
                {activity.category}
              </Text>
            </View>

            {/* Priority */}
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: (colors.priorities[activity.priority] || colors.primary) + '22' },
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

            {activity.hasReminder && (
              <View style={styles.reminderBadge}>
                <Bell size={10} color={colors.secondary} />
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={() => onEdit(activity)}
          >
            <Edit3 size={15} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionButton, styles.deleteButton]}
            onPress={confirmDelete}
          >
            <Trash2 size={15} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      {activity.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {activity.description}
        </Text>
      ) : null}

      {/* Footer Info Row */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Calendar size={13} color={colors.textMuted} />
          <Text style={styles.footerText}>{formatDateDisplay(activity.date)}</Text>
        </View>

        <View style={styles.footerItem}>
          <Clock size={13} color={colors.textMuted} />
          <Text style={styles.footerText}>
            {formatTime12h(activity.startTime)} - {formatTime12h(activity.endTime)} (
            {formatDuration(activity.startTime, activity.endTime)})
          </Text>
        </View>

        {activity.location ? (
          <View style={[styles.footerItem, { flex: 1, justifyContent: 'flex-end' }]}>
            <MapPin size={13} color={colors.textMuted} />
            <Text style={styles.footerText} numberOfLines={1}>
              {activity.location}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...spacing.neu.raisedSm,
    borderLeftWidth: 4.5,
  },
  cardCompleted: {
    opacity: 0.6,
    backgroundColor: colors.surfaceInset,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.xs,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.xs,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
    textTransform: 'uppercase',
  },
  reminderBadge: {
    padding: 3,
    borderRadius: spacing.borderRadius.xs,
    backgroundColor: colors.secondaryMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.raisedSm,
  },
  deleteButton: {
    backgroundColor: colors.dangerMuted,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    marginTop: spacing.xs,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
});
