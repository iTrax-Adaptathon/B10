import { NavigatorScreenParams } from '@react-navigation/native';
import { Activity } from './activity';

export type MainTabParamList = {
  Dashboard: undefined;
  AddActivity: { prefillDate?: string } | undefined;
  ActivityList: { initialFilter?: string; category?: string } | undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Notifications: undefined;
  ActivityDetail: { activity: Activity };
};
