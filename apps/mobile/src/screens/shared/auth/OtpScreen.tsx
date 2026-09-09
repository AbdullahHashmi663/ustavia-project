import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

export function OtpScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Verify your number</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        Enter the code sent to {route.params.phone}
      </Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="XXXX"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <Button label="Verify" onPress={() => navigation.navigate('RolePicker')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 24 },
  subheading: { fontSize: 14, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 8, letterSpacing: 8 },
});
