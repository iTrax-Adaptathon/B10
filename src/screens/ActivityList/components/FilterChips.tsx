import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityFilter } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface FilterChipsProps {
  selectedFilter: ActivityFilter;
  onSelectFilter: (filter: ActivityFilter) => void;
}

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'high_priority', label: 'High Priority' },
  { key: 'completed', label: 'Completed' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((f) => {
        const isSelected = selectedFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            activeOpacity={0.75}
            style={[
              styles.chip,
              isSelected ? styles.chipActive : styles.chipInactive,
            ]}
            onPress={() => onSelectFilter(f.key)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: spacing.borderRadius.full,
  },
  chipInactive: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
});
