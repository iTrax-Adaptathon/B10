import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ActivityProvider } from './src/context/ActivityContext';
import { CommitmentProvider } from './src/context/CommitmentContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

const customNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.danger,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ActivityProvider>
        <CommitmentProvider>
          <NotificationProvider>
            <NavigationContainer theme={customNavigationTheme}>
              <StatusBar style="dark" backgroundColor={colors.background} />
              <RootNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </CommitmentProvider>
      </ActivityProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
