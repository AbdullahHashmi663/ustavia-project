import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CheckCircle2, IdCard, RefreshCw, ShieldCheck } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { Logo } from '../../../components/Logo';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'KycUpload'>;

type SlotKey = 'front' | 'back';

const SLOTS: Array<{ key: SlotKey; label: string; hint: string }> = [
  { key: 'front', label: 'Front side of CNIC', hint: 'Clear photo showing name & CNIC number' },
  { key: 'back', label: 'Back side of CNIC', hint: 'Clear photo showing address & barcode' },
];

/**
 * Modern KYC CNIC upload screen with responsive container, aspect-ratio preview,
 * clear replacement controls, and security reassurance.
 */
export function KycUploadScreen({ navigation }: Props) {
  const { colors, radii, spacing, typography, shadows } = useTheme();
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
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImages((prev) => ({ ...prev, [slot]: result.assets[0].uri }));
    }
  };

  const bothUploaded = Boolean(images.front && images.back);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <View style={styles.logoContainer}>
          <Logo size={48} />
        </View>

        <Text
          style={[
            styles.heading,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: 24,
              marginTop: spacing.lg,
            },
          ]}
        >
          Verify your identity
        </Text>

        <Text
          style={[
            styles.subheading,
            {
              color: colors.textSecondary,
              marginTop: spacing.xs,
              marginBottom: spacing.xl,
              lineHeight: 20,
            },
          ]}
        >
          Upload clear photos of the front and back of your CNIC. Photos must be well-lit and not blurry.
        </Text>

        {SLOTS.map(({ key, label, hint }) => {
          const uri = images[key];
          return (
            <View key={key} style={{ marginBottom: spacing.lg }}>
              <Text
                style={[
                  styles.slotLabel,
                  {
                    color: colors.textPrimary,
                    fontFamily: typography.headingWeights.semibold,
                    fontSize: typography.size.sm,
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                {label}
              </Text>

              <Pressable
                onPress={() => pickImage(key)}
                style={({ pressed }) => [
                  styles.uploadSlot,
                  {
                    borderColor: uri ? colors.success : colors.border,
                    borderWidth: uri ? 2 : 1.5,
                    borderStyle: uri ? 'solid' : 'dashed',
                    backgroundColor: uri ? colors.black : colors.white,
                    borderRadius: radii.lg,
                    opacity: pressed ? 0.9 : 1,
                  },
                  shadows.sm,
                ]}
              >
                {uri ? (
                  <>
                    <Image source={{ uri }} style={styles.preview} resizeMode="cover" />

                    {/* Top Right Verified Check */}
                    <View
                      style={[
                        styles.checkBadge,
                        {
                          backgroundColor: colors.success,
                          borderRadius: radii.full,
                        },
                      ]}
                    >
                      <CheckCircle2 size={16} color={colors.white} strokeWidth={2.5} />
                    </View>

                    {/* Bottom Retake Banner */}
                    <View style={styles.changeOverlay}>
                      <View
                        style={[
                          styles.changePill,
                          {
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            borderRadius: radii.full,
                          },
                        ]}
                      >
                        <RefreshCw size={13} color={colors.white} />
                        <Text style={[styles.changeText, { fontFamily: typography.headingWeights.semibold }]}>
                          Tap to change
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptySlotContent}>
                    <View
                      style={[
                        styles.iconRing,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderRadius: radii.full,
                        },
                      ]}
                    >
                      <IdCard size={28} color={colors.brandBlue} strokeWidth={1.8} />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: spacing.sm, gap: 3 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Camera size={15} color={colors.brandBlue} />
                        <Text
                          style={[
                            styles.uploadCta,
                            {
                              color: colors.brandBlue,
                              fontFamily: typography.headingWeights.semibold,
                              fontSize: typography.size.sm,
                            },
                          ]}
                        >
                          Choose photo
                        </Text>
                      </View>
                      <Text style={[styles.hintText, { color: colors.textMuted, fontSize: typography.size.xs }]}>
                        {hint}
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}

        {/* Security badge */}
        <View
          style={[
            styles.securityRow,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: radii.md,
              padding: spacing.md,
              marginBottom: spacing.xl,
            },
          ]}
        >
          <ShieldCheck size={18} color={colors.brandBlue} strokeWidth={2} />
          <Text
            style={[
              styles.securityText,
              {
                color: colors.textSecondary,
                fontSize: typography.size.xs,
              },
            ]}
          >
            Your documents are 256-bit encrypted and only used for NADRA identity verification.
          </Text>
        </View>

        <Button
          label="Submit for review"
          variant="primary"
          disabled={!bothUploaded}
          onPress={() => navigation.navigate('PendingVerification')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 500,
  },
  logoContainer: {
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
  },
  slotLabel: {
    letterSpacing: 0.1,
  },
  uploadSlot: {
    height: 175,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  emptySlotContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCta: {
    textAlign: 'center',
  },
  hintText: {
    textAlign: 'center',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  securityText: {
    flex: 1,
    lineHeight: 16,
  },
});
