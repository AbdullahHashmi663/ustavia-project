import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, CheckCircle, FileText, Info, ShieldCheck, Upload } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { useTheme } from '../../../theme/ThemeProvider';

export function WorkerCnicScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [cnicNumber, setCnicNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);

  // CNIC auto-formatter (XXXXX-XXXXXXX-X)
  const handleCnicChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 13);
    let formatted = cleaned;
    if (cleaned.length > 5 && cleaned.length <= 12) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    } else if (cleaned.length > 12) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
    }
    setCnicNumber(formatted);
  };

  const pickFrontPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      setFrontPhoto(res.assets[0].uri);
    }
  };

  const pickBackPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      setBackPhoto(res.assets[0].uri);
    }
  };

  const handleContinue = () => {
    navigation.navigate('WorkerSkills', {
      ...route.params,
      cnicNumber,
      issueDate,
      expiryDate,
      frontPhoto,
      backPhoto,
    });
  };

  const isValid = cnicNumber.length === 15 && !!frontPhoto && !!backPhoto;

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      {/* Top Bar with Step Indicator */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.white,
            borderBottomColor: colors.borderSubtle,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing.md,
          },
          shadows.sm,
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full }]}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.stepIndicator,
            { color: colors.brandOrange, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Step 2 of 5
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.heading,
              { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
            ]}
          >
            CNIC Verification
          </Text>
          <ShieldCheck size={24} color={colors.brandBlue} />
        </View>

        <Text style={{ color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg }}>
          NADRA ID verification establishes trust and unlocks high-paying residential and commercial jobs.
        </Text>

        {/* CNIC Number Field */}
        <TextField
          label="CNIC Number"
          placeholder="XXXXX-XXXXXXX-X"
          keyboardType="numeric"
          maxLength={15}
          value={cnicNumber}
          onChangeText={handleCnicChange}
          helperText="Format: 35201-1234567-1 (13 digits with hyphens)"
        />

        {/* Issue & Expiry Dates */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Date of Issue"
              placeholder="DD/MM/YYYY"
              value={issueDate}
              onChangeText={setIssueDate}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Date of Expiry"
              placeholder="DD/MM/YYYY"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>
        </View>

        {/* Dual CNIC Photos Upload Box */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginTop: spacing.lg },
          ]}
        >
          CNIC Photos (Front & Back)
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: spacing.md }}>
          Ensure text and picture are clearly visible without glare or shadows.
        </Text>

        <View style={styles.uploadRow}>
          {/* Front Photo */}
          <Pressable
            onPress={pickFrontPhoto}
            style={[
              styles.uploadCard,
              {
                borderColor: frontPhoto ? colors.success : colors.border,
                backgroundColor: frontPhoto ? 'rgba(16, 185, 129, 0.04)' : colors.surfaceSubtle,
                borderRadius: radii.lg,
              },
            ]}
          >
            {frontPhoto ? (
              <Image source={{ uri: frontPhoto }} style={styles.previewThumb} />
            ) : (
              <View style={styles.emptyUploadContent}>
                <Camera size={26} color={colors.brandOrange} />
                <Text style={[styles.uploadText, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }]}>
                  Front Side
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 10 }}>Tap to Capture</Text>
              </View>
            )}
            {frontPhoto && (
              <View style={[styles.checkBadge, { backgroundColor: colors.success }]}>
                <CheckCircle size={14} color={colors.white} />
              </View>
            )}
          </Pressable>

          {/* Back Photo */}
          <Pressable
            onPress={pickBackPhoto}
            style={[
              styles.uploadCard,
              {
                borderColor: backPhoto ? colors.success : colors.border,
                backgroundColor: backPhoto ? 'rgba(16, 185, 129, 0.04)' : colors.surfaceSubtle,
                borderRadius: radii.lg,
              },
            ]}
          >
            {backPhoto ? (
              <Image source={{ uri: backPhoto }} style={styles.previewThumb} />
            ) : (
              <View style={styles.emptyUploadContent}>
                <Camera size={26} color={colors.brandOrange} />
                <Text style={[styles.uploadText, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }]}>
                  Back Side
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 10 }}>Tap to Capture</Text>
              </View>
            )}
            {backPhoto && (
              <View style={[styles.checkBadge, { backgroundColor: colors.success }]}>
                <CheckCircle size={14} color={colors.white} />
              </View>
            )}
          </Pressable>
        </View>

        {/* Security / NADRA Badge info */}
        <View
          style={[
            styles.trustBox,
            {
              backgroundColor: 'rgba(0, 97, 153, 0.06)',
              borderColor: 'rgba(0, 97, 153, 0.15)',
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <Info size={16} color={colors.brandBlue} />
          <Text style={{ color: colors.textSecondary, fontSize: 11.5, flex: 1, lineHeight: 16 }}>
            Your CNIC data is encrypted with TLS 1.3+ security and cross-referenced with government databases. It is never displayed to customers.
          </Text>
        </View>

        {/* Submit / Continue Button */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Upload & Continue"
            disabled={!isValid}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontSize: 13,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 22,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 13.5,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  uploadCard: {
    flex: 1,
    height: 120,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyUploadContent: {
    alignItems: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 12,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
  },
});
