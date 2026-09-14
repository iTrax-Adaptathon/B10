import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommitments } from '../../context/CommitmentContext';
import { WEEKDAY_LABELS } from '../../types/commitment';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const makeEmptyDays = (): number[] => [1, 2, 3, 4, 5];

export const AddCommitmentScreen: React.FC = () => {
  const { addCommitment } = useCommitments();
  const [title, setTitle] = useState('');
  const [days, setDays] = useState<number[]>(makeEmptyDays());
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('16:00');

  const selectedDaysLabel = useMemo(() => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every((day) => [1, 2, 3, 4, 5].includes(day))) return 'Monday-Friday';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekend';
    return days.map((day) => WEEKDAY_LABELS[day]).join(', ');
  }, [days]);

  const toggleDay = (dayIndex: number) => {
    setDays((current) =>
      current.includes(dayIndex)
        ? current.filter((day) => day !== dayIndex)
        : [...current, dayIndex].sort((a, b) => a - b),
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Name', 'Please provide a commitment name.');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Invalid Time Range', 'End time must be after start time.');
      return;
    }

    if (days.length === 0) {
      Alert.alert('Select Days', 'Choose at least one day for this commitment.');
      return;
    }

    await addCommitment({
      title: title.trim(),
      days,
      startTime,
      endTime,
    });

    Alert.alert('Commitment Saved 🎉', 'Your availability rules have been updated.');
    setTitle('');
    setDays(makeEmptyDays());
    setStartTime('08:30');
    setEndTime('16:00');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Commitment</Text>
        <Text style={styles.subtitle}>
          Create recurring availability blocks (e.g. Work hours, Lectures, Gym) that automatically prevent schedule overlaps.
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Commitment Name</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Core Office Hours, University Lectures"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Active Days</Text>
          <Text style={styles.subLabel}>{selectedDaysLabel}</Text>
          <View style={styles.daysRow}>
            {WEEKDAY_LABELS.map((label, index) => {
              const active = days.includes(index);
              return (
                <TouchableOpacity
                  key={label}
                  activeOpacity={0.8}
                  onPress={() => toggleDay(index)}
                  style={[styles.dayButton, active && styles.dayButtonActive]}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>
                    {label.slice(0, 2)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.formGroup, styles.timeRow]}>
          <View style={styles.timeCol}>
            <Text style={styles.label}>Start Time (24h)</Text>
            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="08:30"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              style={styles.input}
            />
          </View>
          <View style={styles.timeCol}>
            <Text style={styles.label}>End Time (24h)</Text>
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="16:00"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Availability Rule</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl * 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    marginTop: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 4,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  subLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
  },
  input: {
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    ...spacing.neu.recessed,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  dayText: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.xs,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timeCol: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FFFFFF',
    borderBottomColor: 'rgba(79, 70, 229, 0.4)',
    borderRightColor: 'rgba(79, 70, 229, 0.4)',
    ...spacing.neu.glow(colors.primary),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.extrabold,
    fontSize: typography.sizes.md,
  },
});
