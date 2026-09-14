import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface ResourceInputProps {
  resources: string[];
  onChange: (resources: string[]) => void;
}

export const ResourceInput: React.FC<ResourceInputProps> = ({ resources, onChange }) => {
  const [value, setValue] = useState<string>('');

  const addResource = (): void => {
    const resource = value.trim();
    if (!resource || resources.some((item) => item.toLowerCase() === resource.toLowerCase())) return;
    onChange([...resources, resource]);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={addResource}
          placeholder="e.g. Laptop, Projector, Gym Gear"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          accessibilityLabel="Required resource"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addResource}
          accessibilityRole="button"
          accessibilityLabel="Add resource"
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.chips}>
        {resources.map((resource) => (
          <View key={resource} style={styles.chip}>
            <Text style={styles.chipText}>{resource}</Text>
            <TouchableOpacity
              onPress={() => onChange(resources.filter((item) => item !== resource))}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${resource}`}
            >
              <X size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    borderRadius: spacing.borderRadius.md,
    ...spacing.neu.recessed,
  },
  addButton: {
    width: 48,
    minHeight: 48,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceInset,
    borderRadius: spacing.borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
