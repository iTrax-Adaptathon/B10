import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface NeuBoxProps {
  children: React.ReactNode;
  variant?: 'raised' | 'raisedSm' | 'recessed' | 'flat';
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  glowColor?: string;
}

export const NeuBox: React.FC<NeuBoxProps> = ({
  children,
  variant = 'raised',
  style,
  borderRadius = spacing.borderRadius.lg,
  glowColor,
}) => {
  let variantStyle: ViewStyle = {};

  if (variant === 'raised') {
    variantStyle = {
      backgroundColor: colors.surfaceCard,
      ...spacing.neu.raised,
    };
  } else if (variant === 'raisedSm') {
    variantStyle = {
      backgroundColor: colors.surfaceCard,
      ...spacing.neu.raisedSm,
    };
  } else if (variant === 'recessed') {
    variantStyle = {
      backgroundColor: colors.surfaceInset,
      ...spacing.neu.recessed,
    };
  } else {
    variantStyle = {
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.border,
    };
  }

  const glowStyle = glowColor ? spacing.neu.glow(glowColor) : {};

  return (
    <View style={[styles.base, variantStyle, { borderRadius }, glowStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
