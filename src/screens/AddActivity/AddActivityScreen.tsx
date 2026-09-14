import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Hourglass,
  Layers,
  CalendarClock,
  ChevronRight,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { useCommitments } from '../../context/CommitmentContext';
import { useNotifications } from '../../context/NotificationContext';
import { ActivityCategory, ActivityFormData, ActivityType, PriorityLevel } from '../../types/activity';
import { RootStackParamList } from '../../types/navigation';
import { CategorySelector } from './components/CategorySelector';
import { PrioritySelector } from './components/PrioritySelector';
import { ActivityTypeSelector } from './components/ActivityTypeSelector';
import { DependencySelector } from './components/DependencySelector';
import { validateActivity } from '../../utils/activityValidation';
import { getTodayDateString } from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const AddActivityScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activities, addActivity } = useActivities();
  const { commitments } = useCommitments();
  const { addNotification } = useNotifications();

  // Form State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [activityType, setActivityType] = useState<ActivityType>('fixed');
  const [category, setCategory] = useState<ActivityCategory>('work');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [durationMinutes, setDurationMinutes] = useState<string>('60');
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your activity.');
      return;
    }

    const calculatedDuration = activityType === 'flexible'
      ? parseInt(durationMinutes, 10) || 60
      : undefined;

    const assignedTagColor = colors.categories[category] || colors.primary;

    // Run constraint and overlap validation against existing activities and commitments
    const candidateActivity = {
      id: `temp_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'pending' as const,
      date,
      startTime: activityType === 'fixed' ? startTime : (startTime || '09:00'),
      endTime: activityType === 'fixed' ? endTime : (endTime || '10:00'),
      type: activityType,
      duration: calculatedDuration,
      fixedStartTime: activityType === 'fixed' ? startTime : undefined,
      fixedEndTime: activityType === 'fixed' ? endTime : undefined,
      dependencies,
      tagColor: assignedTagColor,
      hasReminder: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validation = validateActivity(candidateActivity, activities, commitments);
    if (!validation.valid) {
      const errorMsg = validation.errors.map((err) => `• ${err.message}`).join('\n');
      Alert.alert('Schedule Conflict / Validation Error', errorMsg);
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
        startTime: activityType === 'fixed' ? startTime : (startTime || '09:00'),
        endTime: activityType === 'fixed' ? endTime : (endTime || '10:00'),
        type: activityType,
        duration: calculatedDuration,
        fixedStartTime: activityType === 'fixed' ? startTime : undefined,
        fixedEndTime: activityType === 'fixed' ? endTime : undefined,
        dependencies: dependencies.length > 0 ? dependencies : undefined,
        tagColor: assignedTagColor,
        hasReminder: true,
        reminderMinutesBefore: 15,
        location: location.trim() || undefined,
      };

      const newActivity = await addActivity(formData);

      // Trigger reminder notification
      await addNotification({
        title: `Scheduled: ${newActivity.title}`,
        message: `Scheduled for ${newActivity.date} at ${newActivity.startTime}. Priority: ${newActivity.priority.toUpperCase()}`,
        type: 'reminder',
        activityId: newActivity.id,
        priority: newActivity.priority === 'urgent' ? 'high' : 'normal',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('work');
      setPriority('medium');
      setActivityType('fixed');
      setDependencies([]);

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

          {/* Add / Manage Commitments Shortcut Banner */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.commitmentBanner}
            onPress={() => navigation.navigate('AddCommitment')}
          >
            <View style={styles.commitmentBannerLeft}>
              <View style={styles.commitmentIconBox}>
                <CalendarClock size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.commitmentBannerTitle}>Add / Manage Commitments</Text>
                <Text style={styles.commitmentBannerSubtitle}>
                  Set recurring classes, work hours, or gym blocks
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

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

          {/* Activity Scheduling Type (Fixed vs Flexible) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduling Mode</Text>
            <ActivityTypeSelector selected={activityType} onSelect={setActivityType} />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <CategorySelector selected={category} onSelect={setCategory} />
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

          {/* Time Fields (Fixed Start/End vs Flexible Duration) */}
          {activityType === 'fixed' ? (
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
          ) : (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Estimated Duration (Minutes)</Text>
              <View style={styles.inputWithIcon}>
                <Hourglass size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inputField}
                  placeholder="60"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
                />
              </View>
            </View>
          )}

          {/* Dependencies Selector */}
          <View style={styles.formGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Layers size={15} color={colors.primary} />
              <Text style={styles.label}>Prerequisite Dependencies</Text>
            </View>
            <DependencySelector
              activities={activities}
              selectedIds={dependencies}
              onChange={setDependencies}
            />
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
