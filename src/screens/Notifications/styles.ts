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
  titleRow: {
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 7,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  actionChipText: {
    color: colors.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnInactive: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  tabBtnText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  listContent: {
    paddingBottom: spacing.xxl * 3,
  },
});
