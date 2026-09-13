import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ShieldCheck } from 'lucide-react-native';

import { ApiError } from '../../../api/client';
import { usePayJob, useJob } from '../../../api/hooks';
import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'EscrowConfirm'>;

/** customer.pdf §10.3 Escrow Confirmation Screen. */
export function EscrowConfirmScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: job } = useJob(jobId);
  const pay = usePayJob();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!job || job.agreedPrice == null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
        <Text style={{ color: colors.textSecondary }}>This job no longer exists.</Text>
      </View>
    );
  }

  const handlePay = async () => {
    setError(null);
    try {
      await pay.mutateAsync(jobId);
      navigation.replace('PaymentSuccess', { jobId });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment failed. Try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.brandBlueLight, borderRadius: radii.full }]}>
        <ShieldCheck size={32} color={colors.brandBlueDark} />
      </View>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Your Payment is Protected
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>
        Rs {job.agreedPrice.toLocaleString()} will be held securely and only released to your Mazdoor once you confirm the job is complete.
      </Text>

      <Pressable onPress={() => setAgreed((v) => !v)} style={[styles.checkboxRow, { marginTop: spacing.xl }]}>
        <View
          style={[
            styles.checkbox,
            {
              borderRadius: radii.sm,
              borderColor: agreed ? colors.brandBlue : colors.border,
              backgroundColor: agreed ? colors.brandBlue : colors.white,
            },
          ]}
        >
          {agreed && <Check size={14} color={colors.white} />}
        </View>
        <Text style={{ color: colors.textPrimary, flex: 1 }}>I understand and agree to how Escrow works</Text>
      </Pressable>

      {error && <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{error}</Text>}

      <View style={{ marginTop: spacing.xl }}>
        <Button
          label={`Pay Rs ${job.agreedPrice.toLocaleString()} & Confirm`}
          disabled={!agreed}
          loading={pay.isPending}
          onPress={handlePay}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  iconCircle: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  heading: { textAlign: 'center' },
  body: { textAlign: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
