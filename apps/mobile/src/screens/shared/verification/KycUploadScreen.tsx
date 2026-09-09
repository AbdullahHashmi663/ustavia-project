import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../components/Button';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'KycUpload'>;

/** Real CNIC image picker + S3 upload lands with the verification module — this pass is UI only. */
export function KycUploadScreen({ navigation }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Verify your identity</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        Upload clear photos of the front and back of your CNIC.
      </Text>

      {['CNIC front', 'CNIC back'].map((label) => (
        <View key={label} style={[styles.uploadSlot, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.textMuted }}>{label}</Text>
        </View>
      ))}

      <Button label="Submit for review" onPress={() => navigation.navigate('PendingVerification')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 24 },
  subheading: { fontSize: 14, marginBottom: 12 },
  uploadSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
