import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PriorityLevel } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface PrioritySelectorProps {
  selected: PriorityLevel;
  onSelect: (priority: PriorityLevel) => void;
}

const PRIORITIES: { key: PriorityLevel; label: string; desc: string; color: string }[] = [
  { key: 'low', label: 'Low', desc: 'Flexible', color: colors.priorities.low },
  { key: 'medium', label: 'Medium', desc: 'Normal', color: colors.priorities.medium },
  { key: 'high', label: 'High', desc: 'Important', color: colors.priorities.high },
  { key: 'urgent', label: 'Urgent', desc: 'Critical', color: colors.priorities.urgent },
];

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {PRIORITIES.map((p) => {
        const isSelected = selected === p.key;
        return (
          <TouchableOpacity
            key={p.key}
            activeOpacity={0.75}
            style={[
              styles.item,
              isSelected ? styles.itemActive : styles.itemInactive,
              isSelected && { borderColor: p.color },
            ]}
            onPress={() => onSelect(p.key)}
          >
            <View style={[styles.dot, { backgroundColor: p.color }]} />
            <Text
              style={[
                styles.label,
                isSelected ? { color: p.color, fontWeight: typography.weights.bold } : undefined,
              ]}
            >
              {p.label}
            </Text>
            <Text style={styles.desc}>{p.desc}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  item: {
    flex: 1,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInactive: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  itemActive: {
    borderWidth: 1.5,
    backgroundColor: colors.surfaceInset,
    ...spacing.neu.recessed,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  desc: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
});
