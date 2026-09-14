import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  Briefcase,
  User,
  Heart,
  GraduationCap,
  Users,
  DollarSign,
  Compass,
} from 'lucide-react-native';
import { ActivityCategory } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface CategorySelectorProps {
  selected: ActivityCategory;
  onSelect: (category: ActivityCategory) => void;
}

interface CategoryOption {
  key: ActivityCategory;
  label: string;
  color: string;
  icon: (color: string) => React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  {
    key: 'work',
    label: 'Work',
    color: colors.categories.work,
    icon: (c) => <Briefcase size={16} color={c} />,
  },
  {
    key: 'meeting',
    label: 'Meeting',
    color: colors.categories.meeting,
    icon: (c) => <Users size={16} color={c} />,
  },
  {
    key: 'study',
    label: 'Study',
    color: colors.categories.study,
    icon: (c) => <GraduationCap size={16} color={c} />,
  },
  {
    key: 'health',
    label: 'Health',
    color: colors.categories.health,
    icon: (c) => <Heart size={16} color={c} />,
  },
  {
    key: 'personal',
    label: 'Personal',
    color: colors.categories.personal,
    icon: (c) => <User size={16} color={c} />,
  },
  {
    key: 'finance',
    label: 'Finance',
    color: colors.categories.finance,
    icon: (c) => <DollarSign size={16} color={c} />,
  },
  {
    key: 'other',
    label: 'Other',
    color: colors.categories.other,
    icon: (c) => <Compass size={16} color={c} />,
  },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            activeOpacity={0.75}
            style={[
              styles.chip,
              isSelected ? styles.chipActive : styles.chipInactive,
              isSelected && { borderColor: cat.color },
            ]}
            onPress={() => onSelect(cat.key)}
          >
            {cat.icon(isSelected ? cat.color : colors.textSecondary)}
            <Text
              style={[
                styles.label,
                isSelected ? { color: cat.color, fontWeight: typography.weights.bold } : undefined,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius.lg,
    marginRight: spacing.xs,
  },
  chipInactive: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  chipActive: {
    borderWidth: 1.5,
    backgroundColor: colors.surfaceInset,
    ...spacing.neu.recessed,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
