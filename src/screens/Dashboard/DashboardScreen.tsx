import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  Clock,
  Flame,
  TrendingUp,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { MetricCard } from './components/MetricCard';
import { TodayActivitiesCarousel } from './components/TodayActivitiesCarousel';
import { UpcomingActivitiesList } from './components/UpcomingActivitiesList';
import { getTodayDateString, formatDateDisplay } from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const DashboardScreen: React.FC = () => {
  const { activities, metrics, toggleCompleteActivity, refreshActivities } =
    useActivities();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const todayStr = getTodayDateString();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshActivities();
    setRefreshing(false);
  };

  const todayActivities = activities
    .filter((a) => a.date === todayStr)
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
              <Text style={styles.dateBadgeText}>{formatDateDisplay(todayStr)}</Text>
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

        {/* Today's Focus Carousel */}
        <TodayActivitiesCarousel
          activities={todayActivities}
          toggleCompleteActivity={toggleCompleteActivity}
        />

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
      </ScrollView>
    </SafeAreaView>
  );
};
