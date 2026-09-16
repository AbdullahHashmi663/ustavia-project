import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PhoneEntryScreen } from '../screens/shared/auth/PhoneEntryScreen';
import { LoginScreen } from '../screens/shared/auth/LoginScreen';
import { OtpScreen } from '../screens/shared/auth/OtpScreen';
import { RolePickerScreen } from '../screens/shared/auth/RolePickerScreen';
import { SetPasswordScreen } from '../screens/shared/auth/SetPasswordScreen';
import { KycUploadScreen } from '../screens/shared/verification/KycUploadScreen';
import { PendingVerificationScreen } from '../screens/shared/verification/PendingVerificationScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="PhoneEntry"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
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
