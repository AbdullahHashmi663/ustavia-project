import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PhoneEntryScreen } from '../screens/shared/auth/PhoneEntryScreen';
import { LoginScreen } from '../screens/shared/auth/LoginScreen';
import { OtpScreen } from '../screens/shared/auth/OtpScreen';
import { RolePickerScreen } from '../screens/shared/auth/RolePickerScreen';
import { SetPasswordScreen } from '../screens/shared/auth/SetPasswordScreen';
import { KycUploadScreen } from '../screens/shared/verification/KycUploadScreen';
import { PendingVerificationScreen } from '../screens/shared/verification/PendingVerificationScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    // Phone → OTP → RolePicker → (SetPassword) → KYC → Pending, matching
    // customer.pdf §2 / Workers.pdf §1.2, plus Login as an alternate entry
    // point for a returning user who set a password (src/api/auth.ts).
    <Stack.Navigator initialRouteName="PhoneEntry" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="RolePicker" component={RolePickerScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="KycUpload" component={KycUploadScreen} />
      <Stack.Screen name="PendingVerification" component={PendingVerificationScreen} />
    </Stack.Navigator>
  );
}
