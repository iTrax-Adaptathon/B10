import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
} from 'lucide-react-native';
import { AppNotification, NotificationType } from '../../../types/notification';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { getRelativeTime } from '../../../utils/dateHelpers';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'reminder':
      return <Bell size={18} color={colors.secondary} />;
    case 'alert':
      return <AlertTriangle size={18} color={colors.danger} />;
    case 'achievement':
      return <CheckCircle2 size={18} color={colors.success} />;
    case 'system':
    default:
      return <Info size={18} color={colors.info} />;
  }
};

const getIconBg = (type: NotificationType) => {
  switch (type) {
    case 'reminder':
      return colors.secondaryMuted;
    case 'alert':
      return colors.dangerMuted;
    case 'achievement':
      return colors.successMuted;
    case 'system':
    default:
      return colors.infoMuted;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
      ]}
      onPress={() => onMarkRead(notification.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: getIconBg(notification.type) }]}>
        {getIcon(notification.type)}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, !notification.isRead && styles.unreadTitle]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={styles.time}>{getRelativeTime(notification.timestamp)}</Text>
        </View>

        <Text style={styles.message} numberOfLines={3}>
          {notification.message}
        </Text>

        {!notification.isRead && (
          <View style={styles.unreadTag}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadTagText}>New Notification</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.deleteBtn}
        onPress={() => onDelete(notification.id)}
      >
        <Trash2 size={15} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...spacing.neu.raisedSm,
  },
  unreadContainer: {
    borderLeftWidth: 3.5,
    borderLeftColor: colors.primary,
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...spacing.neu.recessed,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.xs,
  },
  unreadTitle: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  time: {
    color: colors.textMuted,
    fontSize: 10,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
  unreadTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  unreadTagText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
  },
});
