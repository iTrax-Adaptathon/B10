import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, ActivityCategory } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface CategoryDistributionProps {
  activities: Activity[];
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ activities }) => {
  const total = activities.length;

  if (total === 0) return null;

  // Count by category
  const counts: Partial<Record<ActivityCategory, number>> = {};
  activities.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  const categories = Object.keys(counts) as ActivityCategory[];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Category Distribution</Text>
      
      {/* Recessed progress track visualizer */}
      <View style={styles.barTrack}>
        {categories.map((cat) => {
          const count = counts[cat] || 0;
          const percentage = (count / total) * 100;
          const color = colors.categories[cat] || colors.primary;

          return (
            <View
              key={cat}
              style={[
                styles.barSegment,
                { width: `${percentage}%`, backgroundColor: color },
              ]}
            />
          );
        })}
      </View>

      {/* Legend chips */}
      <View style={styles.legendGrid}>
        {categories.map((cat) => {
          const count = counts[cat] || 0;
          const color = colors.categories[cat] || colors.primary;

          return (
            <View key={cat} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendLabel}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...spacing.neu.raisedSm,
  },
  header: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  barTrack: {
    height: 10,
    borderRadius: spacing.borderRadius.full,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...spacing.neu.recessed,
  },
  barSegment: {
    height: '100%',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: '28%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
