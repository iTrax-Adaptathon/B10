import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from './components/NotificationItem';
import { EmptyNotifications } from './components/EmptyNotifications';
import { styles } from './styles';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert('Clear All Notifications', 'Are you sure you want to remove all notifications from PlanWise?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAllNotifications },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Notifications</Text>
            <View style={styles.actionsRow}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.actionChip}
                  onPress={markAllAsRead}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionChipText}>Mark All Read</Text>
                </TouchableOpacity>
              )}
              {notifications.length > 0 && (
                <TouchableOpacity
                  style={styles.actionChip}
                  onPress={handleClearAll}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionChipText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Neumorphic Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' ? styles.tabBtnActive : styles.tabBtnInactive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'unread' ? styles.tabBtnActive : styles.tabBtnInactive]}
            onPress={() => setActiveTab('unread')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.tabBtnText, activeTab === 'unread' && styles.tabBtnTextActive]}
            >
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyNotifications />}
        />
      </View>
    </SafeAreaView>
  );
};
