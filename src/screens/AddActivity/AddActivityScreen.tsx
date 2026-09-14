import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { useNotifications } from '../../context/NotificationContext';
import { ActivityCategory, ActivityFormData, PriorityLevel } from '../../types/activity';
import { CategorySelector } from './components/CategorySelector';
import { PrioritySelector } from './components/PrioritySelector';
import { TagColorPicker } from './components/TagColorPicker';
import { getTodayDateString } from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const AddActivityScreen: React.FC = () => {
  const { addActivity } = useActivities();
  const { addNotification } = useNotifications();

  // Form State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ActivityCategory>('work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [tagColor, setTagColor] = useState<string>(colors.categories.work);
  const [hasReminder, setHasReminder] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCategoryChange = (newCat: ActivityCategory) => {
    setCategory(newCat);
    setTagColor(colors.categories[newCat] || colors.primary);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your activity.');
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert('Missing Time', 'Please set both start and end times.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: ActivityFormData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        date,
        startTime,
        endTime,
        tagColor,
        hasReminder,
        reminderMinutesBefore: hasReminder ? 15 : undefined,
        location: location.trim() || undefined,
      };

      const newActivity = await addActivity(formData);

      // Trigger automatic reminder notification if enabled
      if (hasReminder) {
        await addNotification({
          title: `Scheduled: ${newActivity.title}`,
          message: `Scheduled for ${newActivity.date} at ${newActivity.startTime}. Priority: ${newActivity.priority.toUpperCase()}`,
          type: 'reminder',
          activityId: newActivity.id,
          priority: newActivity.priority === 'urgent' ? 'high' : 'normal',
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('work');
      setPriority('medium');
      setTagColor(colors.categories.work);

      Alert.alert('Success 🎉', 'Activity scheduled in PlanWise successfully!', [
        { text: 'Great!', style: 'default' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>New Activity</Text>
            <Text style={styles.headerSubtitle}>Plan and organize your tasks seamlessly</Text>
          </View>

          {/* Activity Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Activity Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Executive Sprint Planning"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add notes, agenda items, or deliverables..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <CategorySelector selected={category} onSelect={handleCategoryChange} />
          </View>

          {/* Priority */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority Level</Text>
            <PrioritySelector selected={priority} onSelect={setPriority} />
          </View>

          {/* Date & Location Row */}
          <View style={styles.row}>
            <View style={[styles.col, styles.formGroup]}>
              <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inputField}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            <View style={[styles.col, styles.formGroup]}>
              <Text style={styles.label}>Location / Link</Text>
              <View style={styles.inputWithIcon}>
                <MapPin size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Room / Zoom"
                  placeholderTextColor={colors.textMuted}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>
          </View>

          {/* Time Row */}
          <View style={styles.row}>
            <View style={[styles.col, styles.formGroup]}>
              <Text style={styles.label}>Start Time (24h)</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inputField}
                  placeholder="09:00"
                  placeholderTextColor={colors.textMuted}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
            </View>

            <View style={[styles.col, styles.formGroup]}>
              <Text style={styles.label}>End Time (24h)</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inputField}
                  placeholder="10:30"
                  placeholderTextColor={colors.textMuted}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>
          </View>

          {/* Tag Color Customization */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tag Color</Text>
            <TagColorPicker selectedColor={tagColor} onSelectColor={setTagColor} />
          </View>

          {/* Reminder Switch */}
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Bell size={20} color={hasReminder ? colors.secondary : colors.textMuted} />
                <View>
                  <Text style={styles.switchTitle}>Set Notification Reminder</Text>
                  <Text style={styles.switchSubtitle}>Alert 15 mins before start time</Text>
                </View>
              </View>
              <Switch
                value={hasReminder}
                onValueChange={setHasReminder}
                trackColor={{ false: colors.surfaceInset, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <PlusCircle size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Scheduling...' : 'Create Activity'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
