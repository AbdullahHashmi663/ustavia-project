import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddBankAccountScreen } from '../screens/mazdoor/AddBankAccountScreen';
import { WithdrawalScreen } from '../screens/mazdoor/WithdrawalScreen';
import { ChangePasswordScreen } from '../screens/shared/ChangePasswordScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { DisputeDetailScreen } from '../screens/shared/DisputeDetailScreen';
import { JobDetailScreen } from '../screens/shared/JobDetailScreen';
import { EscrowConfirmScreen } from '../screens/shared/payment/EscrowConfirmScreen';
import { PaymentMethodScreen } from '../screens/shared/payment/PaymentMethodScreen';
import { PaymentSuccessScreen } from '../screens/shared/payment/PaymentSuccessScreen';
import { SosScreen } from '../screens/shared/SosScreen';
import { useAuthStore } from '../store/auth';
import { CustomerTabs } from './CustomerTabs';
import { MazdoorTabs } from './MazdoorTabs';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Switches on user.role, chosen once at signup and permanent for MVP — ARCHITECTURE.md §2.1. */
function Tabs() {
  const role = useAuthStore((state) => state.role);
  return role === 'mazdoor' ? <MazdoorTabs /> : <CustomerTabs />;
}

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ headerShown: true, title: 'Job' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, title: 'Chat' }} />
      <Stack.Screen name="Sos" component={SosScreen} options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{ headerShown: true, title: 'Payment' }}
      />
      <Stack.Screen
        name="EscrowConfirm"
        component={EscrowConfirmScreen}
        options={{ headerShown: true, title: 'Confirm Payment' }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="DisputeDetail"
        component={DisputeDetailScreen}
        options={{ headerShown: true, title: 'Dispute' }}
      />
      <Stack.Screen
        name="Withdrawal"
        component={WithdrawalScreen}
        options={{ headerShown: true, title: 'Withdraw Earnings' }}
      />
      <Stack.Screen
        name="AddBankAccount"
        component={AddBankAccountScreen}
        options={{ headerShown: true, title: 'Add Bank Account' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: true, title: 'Password' }}
      />
    </Stack.Navigator>
  );
}
