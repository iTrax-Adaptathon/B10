import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.borderRadius.full,
    ...spacing.neu.raisedSm,
  },
  countBadgeText: {
    color: colors.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl * 3.5,
  },
  // Calendar Strip & Date Picker Styles
  calendarSection: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...spacing.neu.raisedSm,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarMonthText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  calendarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.surfaceInset,
  },
  viewAllButtonActive: {
    backgroundColor: colors.primary,
  },
  viewAllButtonText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
  viewAllButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  calendarScroll: {
    paddingVertical: 4,
  },
  calendarScrollContent: {
    gap: spacing.xs + 2,
  },
  dateChip: {
    width: 48,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
    position: 'relative',
    ...spacing.neu.raisedSm,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  dateChipToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dateChipMonth: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  dateChipDayName: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: 1,
  },
  dateChipDayNameActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dateChipDayNum: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    marginTop: 2,
  },
  dateChipDayNumActive: {
    color: '#FFFFFF',
  },
  dateDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.secondary,
    position: 'absolute',
    bottom: 5,
  },
  dateDotActive: {
    backgroundColor: '#FFFFFF',
  },
  selectedDateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: spacing.sm,
  },
  selectedDateText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  selectedDateCount: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  emptyState: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    ...spacing.neu.raisedSm,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceInset,
    ...spacing.neu.recessed,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
