import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchX } from 'lucide-react-native';
import { useActivities } from '../../context/ActivityContext';
import { Activity, ActivityFilter } from '../../types/activity';
import { RootStackParamList } from '../../types/navigation';
import { ActivityCard } from './components/ActivityCard';
import { FilterChips } from './components/FilterChips';
import { SearchInput } from './components/SearchInput';
import { EditActivityModal } from './components/EditActivityModal';
import { getTodayDateString } from '../../utils/dateHelpers';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export const ActivityListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activities, toggleCompleteActivity, deleteActivity, updateActivity, refreshActivities } =
    useActivities();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const todayStr = getTodayDateString();

  // Filter & Search computation
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // 1. Search Query Filter
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

      // 2. Chip Status/Date Filter
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
    });
  }, [activities, searchQuery, activeFilter, todayStr]);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>PlanWise Schedule</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredActivities.length} {filteredActivities.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Track, filter, and organize all your activities</Text>
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
                <SearchX size={30} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No activities found</Text>
              <Text style={styles.emptySub}>
                {searchQuery
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
