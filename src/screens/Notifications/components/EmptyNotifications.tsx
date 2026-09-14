import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellOff } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const EmptyNotifications: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <BellOff size={34} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>All Caught Up!</Text>
      <Text style={styles.subtitle}>
        You have no new alerts or activity reminders in PlanWise.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    ...spacing.neu.raisedSm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...spacing.neu.recessed,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
