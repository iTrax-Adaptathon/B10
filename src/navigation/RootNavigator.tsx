import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';
import { ActivityDetailScreen } from '../screens/ActivityDetail/ActivityDetailScreen';
import { AddCommitmentScreen } from '../screens/AddCommitment/AddCommitmentScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontSize: typography.sizes.lg,
          fontWeight: typography.weights.bold,
        },
        headerTintColor: colors.primary,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications & Alerts',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{
          title: 'Activity Details',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="AddCommitment"
        component={AddCommitmentScreen}
        options={{
          title: 'Add Commitment',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};
