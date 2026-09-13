import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BankAccountType } from '@ustavia/shared';

import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const BANKS = ['HBL', 'UBL', 'NBP', 'MCB', 'Meezan Bank', 'Allied Bank', 'Bank Alfalah'];
const ACCOUNT_TYPES: Array<{ id: BankAccountType; label: string }> = [
  { id: 'savings', label: 'Savings' },
  { id: 'current', label: 'Current' },
];

/** Workers.pdf §8.4 Add Bank Account Screen. */
export function AddBankAccountScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const addBankAccount = useJobsStore((state) => state.addBankAccount);

  const [bankName, setBankName] = useState<string | null>(null);
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmNumber, setConfirmNumber] = useState('');
  const [accountType, setAccountType] = useState<BankAccountType>('savings');

  const numbersMatch = accountNumber.length >= 4 && accountNumber === confirmNumber;
  const canSave = bankName != null && holderName.trim().length > 0 && numbersMatch;

  const handleSave = () => {
    if (!userId || !bankName || !canSave) return;
    addBankAccount({
      mazdoorId: userId,
      bankName,
      accountHolderName: holderName.trim(),
      accountNumberLast4: accountNumber.slice(-4),
      accountType,
    });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Bank</Text>
      <View style={[styles.chipRow, { marginTop: spacing.xs, marginBottom: spacing.md }]}>
        {BANKS.map((bank) => {
          const isSelected = bankName === bank;
          return (
            <Pressable
              key={bank}
              onPress={() => setBankName(bank)}
              style={[
                styles.chip,
                {
                  borderRadius: radii.full,
                  borderColor: isSelected ? colors.brandOrange : colors.border,
                  backgroundColor: isSelected ? colors.brandOrange : colors.white,
                },
              ]}
            >
              <Text style={{ color: isSelected ? colors.white : colors.textSecondary, fontSize: typography.size.sm }}>{bank}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: spacing.md }}>
        <TextField label="Account holder name" placeholder="As it appears on your bank account" value={holderName} onChangeText={setHolderName} />
        <TextField
          label="Account number"
          placeholder="16–19 digits"
          keyboardType="number-pad"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />
        <TextField
          label="Confirm account number"
          placeholder="Re-enter account number"
          keyboardType="number-pad"
          value={confirmNumber}
          onChangeText={setConfirmNumber}
          error={confirmNumber.length > 0 && !numbersMatch ? "Account numbers don't match" : undefined}
        />
      </View>

      <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.lg }]}>Account type</Text>
      <View style={[styles.chipRow, { marginTop: spacing.xs }]}>
        {ACCOUNT_TYPES.map(({ id, label }) => {
          const isSelected = accountType === id;
          return (
            <Pressable
              key={id}
              onPress={() => setAccountType(id)}
              style={[
                styles.chip,
                {
                  borderRadius: radii.full,
                  borderColor: isSelected ? colors.brandOrange : colors.border,
                  backgroundColor: isSelected ? colors.brandOrange : colors.white,
                },
              ]}
            >
              <Text style={{ color: isSelected ? colors.white : colors.textSecondary, fontSize: typography.size.sm }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Button label="Save Account" disabled={!canSave} onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  label: { fontSize: 13 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
});
