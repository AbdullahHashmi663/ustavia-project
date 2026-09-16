import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarClock, History, MessageCircle, PlusSquare, Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { PostJobScreen } from '../screens/customer/PostJobScreen';
import { ScheduledScreen } from '../screens/customer/ScheduledScreen';
import { HistoryScreen } from '../screens/customer/HistoryScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { CustomerTabsParamList } from './types';

const Tab = createBottomTabNavigator<CustomerTabsParamList>();

function TabIcon({ Icon, focused, color, size }: { Icon: typeof PlusSquare; focused: boolean; color: string; size: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconWrapper}>
      <Icon color={color} size={size} strokeWidth={focused ? 2.3 : 1.8} />
      {focused && <View style={[styles.activeDot, { backgroundColor: colors.brandBlue }]} />}
    </View>
  );
}

/** Customer navigation with deep trust marine blue (#006199) and active glow dots */
export function CustomerTabs() {
  const { colors, typography, shadows } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandBlue,
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
        name="PostJob"
        component={PostJobScreen}
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={PlusSquare} color={color} size={size} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Scheduled"
        component={ScheduledScreen}
        options={{
          title: 'Scheduled',
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
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => <TabIcon Icon={History} color={color} size={size} focused={focused} />,
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
