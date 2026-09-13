import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { CheckCircle2, IdCard } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'KycUpload'>;

type SlotKey = 'front' | 'back';

const SLOTS: Array<{ key: SlotKey; label: string }> = [
  { key: 'front', label: 'CNIC front' },
  { key: 'back', label: 'CNIC back' },
];

/** Real CNIC upload UI (gallery picker + local preview). S3 upload + NADRA verification land with the backend verification module — ARCHITECTURE.md §2.5, §7. */
export function KycUploadScreen({ navigation }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const [images, setImages] = useState<Partial<Record<SlotKey, string>>>({});

  const pickImage = async (slot: SlotKey) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to upload your CNIC.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setImages((prev) => ({ ...prev, [slot]: result.assets[0].uri }));
    }
  };

  const bothUploaded = Boolean(images.front && images.back);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Logo size={48} />
      <View style={{ height: spacing.lg }} />
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
        Verify your identity
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        Upload clear photos of the front and back of your CNIC. Photos must be clear, well-lit, and not blurry.
      </Text>

      {SLOTS.map(({ key, label }) => {
        const uri = images[key];
        return (
          <Pressable
            key={key}
            onPress={() => pickImage(key)}
            style={[
              styles.uploadSlot,
              {
                borderColor: uri ? colors.success : colors.border,
                backgroundColor: colors.surface,
                borderRadius: radii.md,
                marginBottom: spacing.md,
              },
            ]}
          >
            {uri ? (
              <>
                <Image source={{ uri }} style={styles.preview} />
                <View style={[styles.checkBadge, { backgroundColor: colors.success, borderRadius: radii.full }]}>
                  <CheckCircle2 size={16} color={colors.white} />
                </View>
              </>
            ) : (
              <>
                <IdCard size={24} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, marginTop: 6 }}>{label}</Text>
              </>
            )}
          </Pressable>
        );
      })}

      <View style={{ marginTop: spacing.sm }}>
        <Button label="Submit for review" disabled={!bothUploaded} onPress={() => navigation.navigate('PendingVerification')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  subheading: { fontSize: 14 },
  uploadSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', bottom: 8, right: 8, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
});
