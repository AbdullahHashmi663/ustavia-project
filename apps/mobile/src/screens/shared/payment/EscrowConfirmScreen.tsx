import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ShieldCheck } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useJobsStore } from '../../../store/jobs';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'EscrowConfirm'>;

/** customer.pdf §10.3 Escrow Confirmation Screen. */
export function EscrowConfirmScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const job = useJobsStore((state) => state.jobs.find((j) => j.id === jobId));
  const mazdoors = useJobsStore((state) => state.mazdoors);
  const pay = useJobsStore((state) => state.pay);
  const [agreed, setAgreed] = useState(false);

  if (!job || job.agreedPrice == null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
        <Text style={{ color: colors.textSecondary }}>This job no longer exists.</Text>
      </View>
    );
  }

  const mazdoor = mazdoors.find((m) => m.id === job.mazdoorId);

  const handlePay = () => {
    pay(jobId);
    navigation.replace('PaymentSuccess', { jobId });
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
        Rs {job.agreedPrice.toLocaleString()} will be held securely and only released to {mazdoor?.phone ?? 'your Mazdoor'} once you confirm the job is complete.
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

      <View style={{ marginTop: spacing.xl }}>
        <Button label={`Pay Rs ${job.agreedPrice.toLocaleString()} & Confirm`} disabled={!agreed} onPress={handlePay} />
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
