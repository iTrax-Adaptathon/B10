import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Bell,
  Trash2,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatFullDate, formatTime12h, formatDuration } from '../../utils/dateHelpers';

export const ActivityDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ActivityDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getActivityById, toggleCompleteActivity, deleteActivity } = useActivities();

  // Fetch current state from context or fallback to route param
  const activity = getActivityById(route.params.activity.id) || route.params.activity;
  const isCompleted = activity.status === 'completed';

  const handleDelete = () => {
    Alert.alert('Delete Activity', `Are you sure you want to delete "${activity.title}" from PlanWise?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteActivity(activity.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View style={[styles.headerCard, { borderLeftColor: activity.tagColor || colors.secondary }]}>
          <View style={styles.tagRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: (colors.categories[activity.category] || colors.primary) + '25' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: colors.categories[activity.category] || colors.secondary },
                ]}
              >
                {activity.category.toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: (colors.priorities[activity.priority] || colors.primary) + '25' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: colors.priorities[activity.priority] || colors.secondary },
                ]}
              >
                {activity.priority.toUpperCase()} PRIORITY
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isCompleted ? colors.successMuted : colors.warningMuted,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isCompleted ? colors.success : colors.warning },
                ]}
              >
                {activity.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {activity.title}
          </Text>
        </View>

        {/* Status Toggle Card */}
        <TouchableOpacity
          style={[styles.statusActionCard, isCompleted ? styles.statusActionCompleted : styles.statusActionPending]}
          activeOpacity={0.8}
          onPress={() => toggleCompleteActivity(activity.id)}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} color={colors.success} />
          ) : (
            <Circle size={24} color={colors.textSecondary} />
          )}
          <View style={styles.statusActionTextContainer}>
            <Text style={styles.statusActionTitle}>
              {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            </Text>
            <Text style={styles.statusActionSub}>
              {isCompleted
                ? 'Activity completed on schedule'
                : 'Tap to update progress immediately'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Schedule & Timing Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Schedule Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Calendar size={18} color={colors.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Scheduled Date</Text>
              <Text style={styles.infoValue}>{formatFullDate(activity.date)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Clock size={18} color={colors.primaryLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Time & Duration</Text>
              <Text style={styles.infoValue}>
                {formatTime12h(activity.startTime)} – {formatTime12h(activity.endTime)} (
                {formatDuration(activity.startTime, activity.endTime)})
              </Text>
            </View>
          </View>

          {activity.location ? (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MapPin size={18} color={colors.urgent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location / Link</Text>
                <Text style={styles.infoValue}>{activity.location}</Text>
              </View>
            </View>
          ) : null}

          {activity.hasReminder && (
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Bell size={18} color={colors.warning} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reminder Notification</Text>
                <Text style={styles.infoValue}>
                  Enabled ({activity.reminderMinutesBefore || 15} minutes before start)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Notes / Description */}
        {activity.description ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Notes & Agenda</Text>
            <Text style={styles.descriptionText}>{activity.description}</Text>
          </View>
        ) : null}

        {/* Delete Activity Button */}
        <TouchableOpacity activeOpacity={0.85} style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={18} color={colors.danger} />
          <Text style={styles.deleteText}>Delete Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 3,
  },
  headerCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...spacing.neu.raisedSm,
    borderLeftWidth: 5,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    lineHeight: 30,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  statusActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statusActionPending: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  statusActionCompleted: {
    borderWidth: 1,
    borderColor: colors.success,
    ...spacing.neu.recessed,
  },
  statusActionTextContainer: {
    flex: 1,
  },
  statusActionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  statusActionSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...spacing.neu.raisedSm,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.recessed,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginBottom: 2,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerMuted,
    borderRadius: spacing.borderRadius.xl,
    paddingVertical: 14,
    gap: spacing.xs,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 114, 0.3)',
  },
  deleteText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
