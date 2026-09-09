import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { PostJobScreen } from '../screens/customer/PostJobScreen';
import { ScheduledScreen } from '../screens/customer/ScheduledScreen';
import { HistoryScreen } from '../screens/customer/HistoryScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { CustomerTabsParamList } from './types';

const Tab = createBottomTabNavigator<CustomerTabsParamList>();

/** Customer dashboard accent is brand blue — see design system usage rules. */
export function CustomerTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandBlue,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="PostJob" component={PostJobScreen} />
      <Tab.Screen name="Scheduled" component={ScheduledScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
