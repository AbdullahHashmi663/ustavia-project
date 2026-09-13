import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PhoneEntryScreen } from '../screens/shared/auth/PhoneEntryScreen';
import { OtpScreen } from '../screens/shared/auth/OtpScreen';
import { RolePickerScreen } from '../screens/shared/auth/RolePickerScreen';
import { KycUploadScreen } from '../screens/shared/verification/KycUploadScreen';
import { PendingVerificationScreen } from '../screens/shared/verification/PendingVerificationScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    // Phone → OTP → RolePicker → KYC → Pending, matching customer.pdf §2 / Workers.pdf §1.2.
    // OTP verification is still mocked client-side (any 6 digits succeeds) until
    // SMS_PROVIDER_API_KEY is wired up (see README env vars) — ARCHITECTURE.md §6.
    <Stack.Navigator initialRouteName="PhoneEntry" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="RolePicker" component={RolePickerScreen} />
      <Stack.Screen name="KycUpload" component={KycUploadScreen} />
      <Stack.Screen name="PendingVerification" component={PendingVerificationScreen} />
    </Stack.Navigator>
  );
}
