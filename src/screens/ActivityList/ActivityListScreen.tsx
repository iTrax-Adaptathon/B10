import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CalendarDays,
  Calendar as CalendarIcon,
  SearchX,
  Sparkles,
} from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { Activity, ActivityFilter } from '../../types/activity';
import { RootStackParamList } from '../../types/navigation';
import { ActivityCard } from './components/ActivityCard';
import { FilterChips } from './components/FilterChips';
import { SearchInput } from './components/SearchInput';
import { EditActivityModal } from './components/EditActivityModal';
import {
  getTodayDateString,
  getCalendarDaysWindow,
  formatFullDate,
  formatDateDisplay,
} from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const ActivityListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activities, toggleCompleteActivity, deleteActivity, updateActivity, refreshActivities } =
    useActivities();

  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const calendarScrollRef = useRef<ScrollView>(null);
  const calendarDays = useMemo(() => getCalendarDaysWindow(7, 23), []);

  // Compute map of activity counts per date
  const activityCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const act of activities) {
      map[act.date] = (map[act.date] || 0) + 1;
    }
    return map;
  }, [activities]);

  // Scroll to today's date in calendar strip on initial load
  useEffect(() => {
    const todayIndex = calendarDays.findIndex((d) => d.date === todayStr);
    if (todayIndex >= 0 && calendarScrollRef.current) {
      setTimeout(() => {
        calendarScrollRef.current?.scrollTo({
          x: Math.max(0, (todayIndex - 2) * 56),
          animated: true,
        });
      }, 150);
    }
  }, [calendarDays, todayStr]);

  // Filter & Search computation
  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        // 1. Calendar Date Filter
        if (selectedDate && activity.date !== selectedDate) {
          return false;
        }

        // 2. Search Query Filter
        if (searchQuery.trim().length > 0) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = activity.title.toLowerCase().includes(query);
          const matchesDesc = activity.description?.toLowerCase().includes(query);
          const matchesLoc = activity.location?.toLowerCase().includes(query);
          const matchesCat = activity.category.toLowerCase().includes(query);

          if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) {
            return false;
          }
        }

        // 3. Chip Status Filter
        switch (activeFilter) {
          case 'today':
            return activity.date === todayStr;
          case 'upcoming':
            return activity.date > todayStr;
          case 'high_priority':
            return activity.priority === 'urgent' || activity.priority === 'high';
          case 'completed':
            return activity.status === 'completed';
          case 'all':
          default:
            return true;
        }
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [activities, selectedDate, searchQuery, activeFilter, todayStr]);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  const handlePressActivity = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshActivities();
    setRefreshing(false);
  };

  const currentMonthLabel = useMemo(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Schedule & Calendar</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredActivities.length} {filteredActivities.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Select any date to view and manage scheduled activities</Text>
        </View>

        {/* Interactive Calendar Strip */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <View style={styles.calendarMonthRow}>
              <CalendarIcon size={16} color={colors.primary} />
              <Text style={styles.calendarMonthText}>{currentMonthLabel}</Text>
            </View>
            <View style={styles.calendarActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.viewAllButton, selectedDate === null && styles.viewAllButtonActive]}
                onPress={() => setSelectedDate(null)}
              >
                <Text
                  style={[
                    styles.viewAllButtonText,
                    selectedDate === null && styles.viewAllButtonTextActive,
                  ]}
                >
                  All Dates
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.viewAllButton, selectedDate === todayStr && styles.viewAllButtonActive]}
                onPress={() => setSelectedDate(todayStr)}
              >
                <Text
                  style={[
                    styles.viewAllButtonText,
                    selectedDate === todayStr && styles.viewAllButtonTextActive,
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Horizontal Day Chips */}
          <ScrollView
            ref={calendarScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.calendarScroll}
            contentContainerStyle={styles.calendarScrollContent}
          >
            {calendarDays.map((day) => {
              const isSelected = selectedDate === day.date;
              const hasActivities = (activityCountByDate[day.date] || 0) > 0;

              return (
                <TouchableOpacity
                  key={day.date}
                  activeOpacity={0.75}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipActive,
                    day.isToday && !isSelected && styles.dateChipToday,
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text
                    style={[
                      styles.dateChipDayName,
                      isSelected && styles.dateChipDayNameActive,
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipDayNum,
                      isSelected && styles.dateChipDayNumActive,
                    ]}
                  >
                    {day.dayNum}
                  </Text>
                  {hasActivities && (
                    <View style={[styles.dateDot, isSelected && styles.dateDotActive]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Date Summary Banner */}
        <View style={styles.selectedDateBanner}>
          <Text style={styles.selectedDateText}>
            {selectedDate ? formatFullDate(selectedDate) : 'All Scheduled Activities'}
          </Text>
          <Text style={styles.selectedDateCount}>
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
          </Text>
        </View>

        {/* Search Input */}
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

        {/* Filter Chips */}
        <FilterChips selectedFilter={activeFilter} onSelectFilter={setActiveFilter} />

        {/* List of Activities */}
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onToggleComplete={toggleCompleteActivity}
              onEdit={handleEdit}
              onDelete={deleteActivity}
              onPress={handlePressActivity}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <CalendarDays size={30} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>
                {selectedDate
                  ? `No activities for ${formatDateDisplay(selectedDate)}`
                  : 'No activities found'}
              </Text>
              <Text style={styles.emptySub}>
                {selectedDate
                  ? 'Your schedule is clear on this date. Tap "Add Activity" to plan your tasks!'
                  : searchQuery
                  ? 'No results match your search keywords.'
                  : 'No scheduled activities found in this filter view.'}
              </Text>
            </View>
          }
        />

        {/* Edit Modal */}
        <EditActivityModal
          visible={isEditModalOpen}
          activity={editingActivity}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingActivity(null);
          }}
          onSave={updateActivity}
        />
      </View>
    </SafeAreaView>
  );
};
