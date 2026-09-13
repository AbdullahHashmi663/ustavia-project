import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Lock } from 'lucide-react-native';

import { setPassword as setPasswordApi } from '../../api/auth';
import { ApiError } from '../../api/client';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useTheme } from '../../theme/ThemeProvider';

/** Reached from SettingsScreen — set a password for the first time, or change an existing one. Same `POST /auth/password` SetPasswordScreen uses during onboarding. */
export function ChangePasswordScreen() {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const passwordSet = useAuthStore((state) => state.passwordSet);
  const setPasswordSet = useAuthStore((state) => state.setPasswordSet);
  const [password, setPasswordInput] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await setPasswordApi(password);
      setPasswordSet(true);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.lg, textAlign: 'center' }}>
          Password saved
        </Text>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
          You can now log in with your phone number and this password.
        </Text>
        <View style={{ marginTop: spacing.xl, width: '100%' }}>
          <Button label="Done" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={{ color: colors.textSecondary, marginBottom: spacing.lg }}>
        {passwordSet
          ? 'Enter a new password to replace your current one.'
          : "You haven't set a password yet — add one to log in without an SMS code next time."}
      </Text>

      <TextField placeholder="New password" secureTextEntry value={password} onChangeText={setPasswordInput} icon={Lock} />
      <View style={{ height: spacing.md }} />
      <TextField placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} icon={Lock} />

      {error && <Text style={{ color: colors.danger, marginTop: spacing.sm, fontSize: typography.size.sm }}>{error}</Text>}

      <View style={{ marginTop: spacing.lg }}>
        <Button label={passwordSet ? 'Update Password' : 'Set Password'} loading={loading} disabled={!password || !confirm} onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
