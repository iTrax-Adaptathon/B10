import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl * 3,
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  dateBadge: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.neu.raisedSm,
  },
  dateBadgeText: {
    color: colors.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  metricsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sectionBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  sectionBadgeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  weekDaysScroll: {
    marginBottom: spacing.md,
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    marginRight: spacing.xs,
    minWidth: 56,
    ...spacing.neu.raisedSm,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FFFFFF',
    borderBottomColor: 'rgba(79, 70, 229, 0.5)',
    borderRightColor: 'rgba(79, 70, 229, 0.5)',
    ...spacing.neu.glow(colors.primary),
  },
  dayChipName: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  dayChipNameActive: {
    color: '#FFFFFF',
  },
  dayChipNum: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  dayChipNumActive: {
    color: '#FFFFFF',
  },
});
