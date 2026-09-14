import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by title, location, category...',
}) => {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChangeText('')}
          style={styles.clearBtn}
        >
          <X size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.sm + 4,
    marginBottom: spacing.sm,
    ...spacing.neu.recessed,
  },
  icon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
  },
  clearBtn: {
    padding: 6,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
});
