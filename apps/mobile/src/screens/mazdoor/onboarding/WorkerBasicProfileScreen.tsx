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
import { ArrowLeft, Camera, User } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { useTheme } from '../../../theme/ThemeProvider';

export function WorkerBasicProfileScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const phone = route.params?.phone || '+92 300 1234567';
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      setPhotoUri(res.assets[0].uri);
    }
  };

  const handleContinue = () => {
    navigation.navigate('WorkerCnic', {
      phone,
      fullName,
      gender,
      dob,
      photoUri,
    });
  };

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
          Step 1 of 5
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.heading,
            { color: colors.textPrimary, fontFamily: typography.headingWeights.bold },
          ]}
        >
          Basic Profile Details
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xl }}>
          Provide your legal details to create your service professional profile.
        </Text>

        {/* Circular Profile Photo Upload */}
        <View style={styles.photoContainer}>
          <Pressable onPress={pickImage} style={[styles.avatarFrame, { borderColor: colors.brandOrange }, shadows.sm]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceSubtle }]}>
                <User size={42} color={colors.textMuted} />
              </View>
            )}
            <View style={[styles.cameraBadge, { backgroundColor: colors.brandOrange }]}>
              <Camera size={14} color={colors.white} strokeWidth={2.5} />
            </View>
          </Pressable>
          <Text style={[styles.photoHint, { color: colors.textMuted, marginTop: 8 }]}>
            Tap to upload clear profile photo
          </Text>
        </View>

        {/* Full Name */}
        <View style={{ marginTop: spacing.xl }}>
          <TextField
            label="Full Name (as on CNIC)"
            placeholder="e.g. Tariq Mehmood"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Locked Phone */}
        <View style={{ marginTop: spacing.md }}>
          <TextField
            label="Registered Phone Number"
            value={phone}
            editable={false}
          />
        </View>

        {/* Date of Birth */}
        <View style={{ marginTop: spacing.md }}>
          <TextField
            label="Date of Birth (DD/MM/YYYY)"
            placeholder="e.g. 15/08/1992"
            value={dob}
            onChangeText={setDob}
          />
        </View>

        {/* Gender Selection Pills */}
        <View style={{ marginTop: spacing.md }}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold },
            ]}
          >
            Gender
          </Text>
          <View style={styles.genderRow}>
            {(['Male', 'Female', 'Other'] as const).map((g) => {
              const active = gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderPill,
                    {
                      backgroundColor: active ? colors.brandOrange : colors.white,
                      borderColor: active ? colors.brandOrange : colors.borderSubtle,
                      borderRadius: radii.full,
                    },
                    active && shadows.sm,
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.white : colors.textPrimary,
                      fontSize: 13,
                      fontFamily: active ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    }}
                  >
                    {g}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ marginTop: spacing.xxl }}>
          <Button
            label="Continue to ID Verification"
            disabled={!fullName.trim()}
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
  heading: {
    fontSize: 22,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    position: 'relative',
    overflow: 'visible',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoHint: {
    fontSize: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
