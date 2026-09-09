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
    // TEMP initialRouteName: real entry is PhoneEntry once OTP/SMS_PROVIDER_API_KEY is wired up
    // (see README env vars) — RolePicker first makes the themed screen reachable immediately
    // during this scaffolding pass, per this milestone's acceptance criteria.
    <Stack.Navigator initialRouteName="RolePicker" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="RolePicker" component={RolePickerScreen} />
      <Stack.Screen name="KycUpload" component={KycUploadScreen} />
      <Stack.Screen name="PendingVerification" component={PendingVerificationScreen} />
    </Stack.Navigator>
  );
}
