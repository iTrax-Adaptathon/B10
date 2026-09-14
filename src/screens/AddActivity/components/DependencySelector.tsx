import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Activity } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface DependencySelectorProps {
  activities: Activity[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const DependencySelector: React.FC<DependencySelectorProps> = ({
  activities,
  selectedIds,
  onChange,
}) => {
  const selected = activities.filter((activity) => selectedIds.includes(activity.id));
  const available = activities.filter((activity) => !selectedIds.includes(activity.id));

  const toggle = (id: string): void => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id]);
  };

  return (
    <View>
      {selected.length > 0 && (
        <View style={styles.selectedList}>
          {selected.map((activity) => (
            <View key={activity.id} style={styles.selectedChip}>
              <Text style={styles.selectedText} numberOfLines={1}>{activity.title}</Text>
              <TouchableOpacity
                onPress={() => toggle(activity.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${activity.title} dependency`}
              >
                <X size={15} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {available.length === 0 ? (
        <Text style={styles.helper}>No other activities available.</Text>
      ) : (
        <View style={styles.options}>
          {available.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.option}
              onPress={() => toggle(activity.id)}
              accessibilityRole="checkbox"
              accessibilityLabel={`Add ${activity.title} as dependency`}
            >
              <Text style={styles.optionText} numberOfLines={1}>{activity.title}</Text>
              <Text style={styles.optionMeta}>{activity.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedList: { gap: spacing.xs, marginBottom: spacing.xs },
  selectedChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primaryMuted, borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  selectedText: { color: colors.primary, fontSize: typography.sizes.sm, flex: 1, marginRight: spacing.xs },
  options: { gap: spacing.xs },
  option: {
    minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.sm, backgroundColor: colors.surfaceCard, ...spacing.neu.raisedSm,
  },
  optionText: { color: colors.textPrimary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  optionMeta: { color: colors.textMuted, fontSize: typography.sizes.xs, marginTop: 2 },
  helper: { color: colors.textMuted, fontSize: typography.sizes.sm },
});
