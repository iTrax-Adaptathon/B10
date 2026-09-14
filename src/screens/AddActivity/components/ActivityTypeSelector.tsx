import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ActivityType } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface ActivityTypeSelectorProps {
  selected: ActivityType;
  onSelect: (type: ActivityType) => void;
}

export const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({ selected, onSelect }) => (
  <View style={styles.container} accessibilityRole="radiogroup">
    {(['fixed', 'flexible'] as ActivityType[]).map((type) => {
      const isSelected = selected === type;
      return (
        <TouchableOpacity
          key={type}
          style={[styles.option, isSelected ? styles.optionActive : styles.optionInactive]}
          onPress={() => onSelect(type)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${type} activity`}
        >
          <Text style={[styles.label, isSelected && styles.labelActive]}>
            {type === 'fixed' ? 'Fixed' : 'Flexible'}
          </Text>
          <Text style={styles.description}>
            {type === 'fixed' ? 'Set a specific time' : 'Schedule within a window'}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.xs },
  option: {
    flex: 1,
    minHeight: 62,
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionActive: { backgroundColor: colors.primaryMuted, borderWidth: 1.5, borderColor: colors.primary },
  optionInactive: { backgroundColor: colors.surfaceCard, ...spacing.neu.raisedSm },
  label: { color: colors.textPrimary, fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  labelActive: { color: colors.primary },
  description: { color: colors.textMuted, fontSize: typography.sizes.xs, marginTop: 3 },
});
