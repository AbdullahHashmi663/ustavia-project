import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarClock, History, MessageCircle, PlusSquare, Settings } from 'lucide-react-native';

import { PostJobScreen } from '../screens/customer/PostJobScreen';
import { ScheduledScreen } from '../screens/customer/ScheduledScreen';
import { HistoryScreen } from '../screens/customer/HistoryScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
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
      <Tab.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{ title: 'Post Job', tabBarIcon: ({ color, size }) => <PlusSquare color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Scheduled"
        component={ScheduledScreen}
        options={{ tabBarIcon: ({ color, size }) => <CalendarClock color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ color, size }) => <History color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
