import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommitments } from '../../context/CommitmentContext';
import { WEEKDAY_LABELS } from '../../types/commitment';
import { colors } from '../../theme/colors';

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
      Alert.alert('Missing name', 'Please provide a commitment name.');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Invalid time range', 'End time must be after start time.');
      return;
    }

    if (days.length === 0) {
      Alert.alert('Select days', 'Choose at least one day for this commitment.');
      return;
    }

    await addCommitment({
      title: title.trim(),
      days,
      startTime,
      endTime,
    });

    Alert.alert('Commitment saved', 'Your availability rules have been updated.');
    setTitle('');
    setDays(makeEmptyDays());
    setStartTime('08:30');
    setEndTime('16:00');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 30, fontWeight: '800', marginTop: 16 }}>Add Commitment</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>Create a generic availability block that affects scheduling across the app.</Text>

        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>Commitment name</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="School, Office, Workout, Client call..."
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.textPrimary,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        </View>

        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>Days</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 8 }}>{selectedDaysLabel}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {WEEKDAY_LABELS.map((label, index) => {
              const active = days.includes(index);
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => toggleDay(index)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? colors.primary : '#F8FAFC',
                    borderWidth: 1,
                    borderColor: active ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ color: active ? '#FFFFFF' : colors.textPrimary, fontWeight: '700', fontSize: 12 }}>{label.slice(0, 2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ marginBottom: 18, flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>Start time</Text>
            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="08:30"
              keyboardType="numbers-and-punctuation"
              style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>End time</Text>
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="16:00"
              keyboardType="numbers-and-punctuation"
              style={{ backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border }}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Save Commitment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
