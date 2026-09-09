import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

export function PhoneEntryScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Enter your phone number</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        We'll text you a one-time code to verify it's you.
      </Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="+92XXXXXXXXXX"
        placeholderTextColor={colors.textMuted}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button label="Send OTP" onPress={() => navigation.navigate('Otp', { phone })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 24 },
  subheading: { fontSize: 14, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 8 },
});
