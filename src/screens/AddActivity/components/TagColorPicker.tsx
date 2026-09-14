import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { spacing } from '../../../theme/spacing';

interface TagColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const PALETTE = [
  '#6366F1', // Indigo
  '#00E5FF', // Cyan
  '#38BDF8', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#FF4B72', // Coral/Pink
  '#FF3366', // Red
  '#8B5CF6', // Purple
  '#94A3B8', // Slate
];

export const TagColorPicker: React.FC<TagColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      {PALETTE.map((color) => {
        const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
        return (
          <TouchableOpacity
            key={color}
            activeOpacity={0.75}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              isSelected && styles.selectedCircle,
            ]}
            onPress={() => onSelectColor(color)}
          >
            {isSelected && <Check size={14} color="#FFFFFF" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.raisedSm,
  },
  selectedCircle: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.12 }],
  },
});
