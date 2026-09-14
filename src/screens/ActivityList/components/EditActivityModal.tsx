import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Activity, ActivityCategory, PriorityLevel, ActivityStatus } from '../../../types/activity';
import { CategorySelector } from '../../AddActivity/components/CategorySelector';
import { PrioritySelector } from '../../AddActivity/components/PrioritySelector';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface EditActivityModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Activity>) => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  visible,
  activity,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [status, setStatus] = useState<ActivityStatus>('pending');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description || '');
      setCategory(activity.category);
      setPriority(activity.priority);
      setStatus(activity.status);
      setDate(activity.date);
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setLocation(activity.location || '');
    }
  }, [activity]);

  if (!activity) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    onSave(activity.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      date,
      startTime,
      endTime,
      location: location.trim() || undefined,
      tagColor: colors.categories[category] || colors.primary,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Activity</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Activity Title"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Notes or agenda"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Status Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {(['pending', 'in_progress', 'completed'] as ActivityStatus[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusChip, status === s ? styles.statusChipActive : styles.statusChipInactive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text
                      style={[styles.statusText, status === s && styles.statusTextActive]}
                    >
                      {s.replace('_', ' ').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <CategorySelector selected={category} onSelect={setCategory} />
            </View>

            {/* Priority */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <PrioritySelector selected={priority} onSelect={setPriority} />
            </View>

            {/* Date & Location */}
            <View style={styles.row}>
              <View style={[styles.col, styles.formGroup]}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={[styles.col, styles.formGroup]}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Location"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Time */}
            <View style={styles.row}>
              <View style={[styles.col, styles.formGroup]}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="09:00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={[styles.col, styles.formGroup]}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="10:00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Check size={18} color="#FFFFFF" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.lg,
    maxHeight: '88%',
    borderTopWidth: 2,
    borderTopColor: '#FFFFFF',
    ...spacing.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.raisedSm,
  },
  formScroll: {
    marginBottom: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginBottom: 4,
  },
  input: {
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    ...spacing.neu.recessed,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  col: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
  },
  statusChipInactive: {
    backgroundColor: colors.surfaceCard,
    ...spacing.neu.raisedSm,
  },
  statusChipActive: {
    backgroundColor: colors.primary,
    ...spacing.neu.glow(colors.primary),
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: spacing.borderRadius.xl,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.neu.raisedSm,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: spacing.borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...spacing.neu.glow(colors.primary),
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
