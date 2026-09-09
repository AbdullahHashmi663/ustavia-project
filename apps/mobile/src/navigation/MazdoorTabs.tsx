import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DashboardScreen } from '../screens/mazdoor/DashboardScreen';
import { ScheduleScreen } from '../screens/mazdoor/ScheduleScreen';
import { AnalyticsScreen } from '../screens/mazdoor/AnalyticsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { MazdoorTabsParamList } from './types';

const Tab = createBottomTabNavigator<MazdoorTabsParamList>();

/** Mazdoor dashboard accent is brand orange — see design system usage rules. */
export function MazdoorTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandOrange,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}
