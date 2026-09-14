import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { MetricCard } from './components/MetricCard';
import { TodayScheduleTimeline } from './components/TodayScheduleTimeline';
import { UpcomingActivitiesList } from './components/UpcomingActivitiesList';
import { CategoryDistribution } from './components/CategoryDistribution';
import { getNextSevenDays, getTodayDateString, formatDateDisplay } from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const DashboardScreen: React.FC = () => {
  const { activities, metrics, toggleCompleteActivity, refreshActivities } =
    useActivities();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const weekDays = getNextSevenDays();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshActivities();
    setRefreshing(false);
  };

  const selectedDateActivities = activities
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingUrgent = activities
    .filter((a) => (a.priority === 'urgent' || a.priority === 'high') && a.status !== 'completed')
    .slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingText}>Welcome to PlanWise</Text>
              <Text style={styles.titleText}>Overview</Text>
            </View>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{formatDateDisplay(getTodayDateString())}</Text>
            </View>
          </View>
        </View>

        {/* Top 4 Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Today's Total"
              value={metrics.todayTotal}
              subtitle={`${metrics.todayCompleted} completed`}
              accentColor={colors.secondary}
              bgGlow={colors.secondaryMuted}
              icon={<CalendarDays size={18} color={colors.secondary} />}
            />
            <MetricCard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              subtitle="Efficiency goal"
              accentColor={colors.success}
              bgGlow={colors.successMuted}
              icon={<TrendingUp size={18} color={colors.success} />}
            />
          </View>

          <View style={styles.metricsRow}>
            <MetricCard
              title="Pending Items"
              value={metrics.pendingActivities}
              subtitle="To be completed"
              accentColor={colors.warning}
              bgGlow={colors.warningMuted}
              icon={<Clock size={18} color={colors.warning} />}
            />
            <MetricCard
              title="Urgent Tasks"
              value={metrics.urgentCount}
              subtitle="Immediate focus"
              accentColor={colors.danger}
              bgGlow={colors.dangerMuted}
              icon={<Flame size={18} color={colors.danger} />}
            />
          </View>
        </View>

        {/* Schedule Timeline Header with 7-Day Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Daily Schedule</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{selectedDateActivities.length} items</Text>
              </View>
            </View>
          </View>

          {/* 7-Day Quick Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.weekDaysScroll}
          >
            {weekDays.map((day) => {
              const isSelected = day.date === selectedDate;
              return (
                <TouchableOpacity
                  key={day.date}
                  style={[styles.dayChip, isSelected && styles.dayChipActive]}
                  onPress={() => setSelectedDate(day.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayChipName, isSelected && styles.dayChipNameActive]}>
                    {day.dayName}
                  </Text>
                  <Text style={[styles.dayChipNum, isSelected && styles.dayChipNumActive]}>
                    {day.dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Timeline */}
          <TodayScheduleTimeline
            activities={selectedDateActivities}
            onToggleComplete={toggleCompleteActivity}
          />
        </View>

        {/* Priority Focus Section */}
        {upcomingUrgent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Flame size={18} color={colors.urgent} />
                <Text style={styles.sectionTitle}>High Priority Focus</Text>
              </View>
            </View>
            <UpcomingActivitiesList activities={upcomingUrgent} />
          </View>
        )}

        {/* Category Breakdown */}
        <CategoryDistribution activities={activities} />
      </ScrollView>
    </SafeAreaView>
  );
};
