import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarClock, LayoutGrid, MessageCircle, Settings, Wallet as WalletIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { DashboardScreen } from '../screens/mazdoor/DashboardScreen';
import { ScheduleScreen } from '../screens/mazdoor/ScheduleScreen';
import { WalletScreen } from '../screens/mazdoor/WalletScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { MazdoorTabsParamList } from './types';

const Tab = createBottomTabNavigator<MazdoorTabsParamList>();

function TabIcon({ Icon, focused, color, size }: { Icon: typeof LayoutGrid; focused: boolean; color: string; size: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconWrapper}>
      <Icon color={color} size={size} strokeWidth={focused ? 2.3 : 1.8} />
      {focused && <View style={[styles.activeDot, { backgroundColor: colors.brandOrange }]} />}
    </View>
  );
}

/** Mazdoor navigation with vibrant energy orange (#FF6701) and active glow dots */
export function MazdoorTabs() {
  const { colors, typography, shadows } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandOrange,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.white,
            borderTopColor: colors.borderSubtle,
          },
          shadows.md,
        ],
        tabBarLabelStyle: {
          fontFamily: typography.headingWeights.semibold,
          fontSize: 11,
          marginTop: -2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={LayoutGrid} color={color} size={size} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={CalendarClock} color={color} size={size} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={MessageCircle} color={color} size={size} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={WalletIcon} color={color} size={size} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={Settings} color={color} size={size} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -4,
  },
});
