import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2 } from 'lucide-react-native';

import { useJob } from '../../../api/hooks';
import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'PaymentSuccess'>;

/** customer.pdf §10.5 Payment Success Screen. */
export function PaymentSuccessScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: job } = useJob(jobId);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.successLight, borderRadius: radii.full }]}>
        <CheckCircle2 size={40} color={colors.success} />
      </View>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Payment Successful
      </Text>
      {job?.agreedPrice != null && (
        <Text style={[styles.amount, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
          Rs {job.agreedPrice.toLocaleString()}
        </Text>
      )}
      <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, marginTop: spacing.xs }}>Job #{jobId.slice(0, 8)}</Text>

      <View style={{ marginTop: spacing.xxl, width: '100%' }}>
        <Button label="Done" onPress={() => navigation.navigate('JobDetail', { jobId })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heading: { textAlign: 'center' },
  amount: { fontSize: 32, marginTop: 8 },
});
