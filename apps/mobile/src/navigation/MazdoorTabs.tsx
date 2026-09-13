import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarClock, LayoutGrid, MessageCircle, Settings, Wallet as WalletIcon } from 'lucide-react-native';

import { DashboardScreen } from '../screens/mazdoor/DashboardScreen';
import { ScheduleScreen } from '../screens/mazdoor/ScheduleScreen';
import { WalletScreen } from '../screens/mazdoor/WalletScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
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
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ tabBarIcon: ({ color, size }) => <CalendarClock color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ tabBarIcon: ({ color, size }) => <WalletIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
