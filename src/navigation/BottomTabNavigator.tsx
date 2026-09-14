import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, CalendarPlus, ListTodo, Sparkles } from 'lucide-react-native';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { AddActivityScreen } from '../screens/AddActivity/AddActivityScreen';
import { ActivityListScreen } from '../screens/ActivityList/ActivityListScreen';
import { TopLeftNotificationButton } from './HeaderButtons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabItem {
  key: string;
  label: string;
  icon: (color: string, focused: boolean) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (c, f) => <LayoutDashboard size={f ? 21 : 19} color={c} />,
  },
  {
    key: 'add',
    label: 'Add Activity',
    icon: (c, f) => <CalendarPlus size={f ? 23 : 21} color={c} />,
  },
  {
    key: 'list',
    label: 'Activities',
    icon: (c, f) => <ListTodo size={f ? 21 : 19} color={c} />,
  },
];

export const BottomTabNavigator: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);
  const tabScaleAnim = useRef(new Animated.Value(1)).current;

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });

    Animated.sequence([
      Animated.timing(tabScaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(tabScaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex >= 0 && newIndex < TABS.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header with PlanWise Branding & Notification Bell */}
      <View style={styles.header}>
        <TopLeftNotificationButton />
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>PlanWise</Text>
          <View style={styles.headerBadge}>
            <Sparkles size={11} color={colors.primary} />
            <Text style={styles.headerBadgeText}>
              {activeIndex === 0 ? 'Overview' : activeIndex === 1 ? 'New Task' : 'Schedule'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Full-Screen Swipeable Paging Container */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        decelerationRate="fast"
        bounces={false}
        style={styles.pager}
      >
        <View style={styles.page}>
          <DashboardScreen />
        </View>
        <View style={styles.page}>
          <AddActivityScreen />
        </View>
        <View style={styles.page}>
          <ActivityListScreen />
        </View>
      </ScrollView>

      {/* Floating Curved Neumorphic Bottom Navigation Bar */}
      <Animated.View
        style={[
          styles.curvedTabBarContainer,
          { transform: [{ scale: tabScaleAnim }] },
        ]}
      >
        <View style={styles.curvedTabBar}>
          {TABS.map((tab, idx) => {
            const isFocused = activeIndex === idx;
            const isCenter = idx === 1;

            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => handleTabPress(idx)}
                style={[
                  styles.tabItem,
                  isFocused && !isCenter && styles.tabItemActive,
                  isCenter && (isFocused ? styles.centerTabActive : styles.centerTab),
                ]}
              >
                {tab.icon(
                  isFocused
                    ? isCenter
                      ? '#FFFFFF'
                      : colors.primary
                    : colors.textMuted,
                  isFocused
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : undefined,
                    isCenter && isFocused ? styles.centerLabelActive : undefined,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  headerBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  pager: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  // Floating Curved Neumorphic Bar for White/Light Theme
  curvedTabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 99,
  },
  curvedTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceCard,
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.35)',
    borderRightColor: 'rgba(148, 163, 184, 0.35)',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 22,
  },
  tabItemActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  centerTab: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 22,
    paddingVertical: 8,
    marginHorizontal: 4,
    ...spacing.neu.raisedSm,
  },
  centerTabActive: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 8,
    marginHorizontal: 4,
    ...spacing.neu.glow(colors.primary),
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.weights.medium,
    marginTop: 3,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  centerLabelActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
});
