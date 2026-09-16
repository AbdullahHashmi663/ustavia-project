import { useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

interface FaqItem {
  id: string;
  category: 'Escrow & Payments' | 'Bookings & Jobs' | 'Safety & SOS' | 'Warranty & Disputes';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'f1',
    category: 'Escrow & Payments',
    question: 'How does the Ustavia Escrow system work?',
    answer:
      'Your payment is securely held in an SBP-regulated escrow account. The Mazdoor is only released funds after you inspect the completed work and provide your 4-digit doorstep PIN.',
  },
  {
    id: 'f2',
    category: 'Escrow & Payments',
    question: 'Which Pakistani payment methods are supported?',
    answer:
      'We accept JazzCash, Easypaisa, Raast (State Bank Instant zero-fee rails), NayaPay, SadaPay, Debit/Credit Cards (Visa/Mastercard/PayPak), and Cash on Delivery.',
  },
  {
    id: 'f3',
    category: 'Warranty & Disputes',
    question: 'What is the 7-Day Ustavia Workmanship Warranty?',
    answer:
      'Every completed job is backed by our 7-Day Ustavia Workmanship Warranty. If any defect or issue recurs within 7 days of service completion, Ustavia dispatches a verified worker for free inspection and rework.',
  },
  {
    id: 'f4',
    category: 'Warranty & Disputes',
    question: 'How do I raise a dispute if work is unsatisfactory?',
    answer:
      'Open the job details and tap "Report Dispute". Select the issue type (Incomplete Work, Damage, Unreasonable Overcharge, Unprofessional Conduct) and submit photos. Our mediation team will intervene within 2 hours.',
  },
  {
    id: 'f5',
    category: 'Safety & SOS',
    question: 'How does the Emergency SOS button work?',
    answer:
      'The SOS feature requires a slide gesture to prevent false alarms. Once slid, your live GPS coordinates are transmitted to Ustavia Incident Control, local police (15), and your registered emergency contacts.',
  },
  {
    id: 'f6',
    category: 'Bookings & Jobs',
    question: 'Can I compare multiple bids before choosing a worker?',
    answer:
      'Yes! When you post a task, verified nearby workers submit competitive bids. You can compare their ratings, completed jobs, estimated arrival times, and quoted prices before accepting.',
  },
  {
    id: 'f7',
    category: 'Safety & SOS',
    question: 'Are all Ustavia Mazdoors background checked?',
    answer:
      'Yes. Every worker undergoes strict NADRA CNIC verification, police criminal record screening, and trade skill certifications before they can accept bookings on Ustavia.',
  },
];

const CATEGORIES = ['All', 'Escrow & Payments', 'Bookings & Jobs', 'Warranty & Disputes', 'Safety & SOS'] as const;

export function HelpCenterScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [expandedId, setExpandedId] = useState<string | null>('f1');

  // Ticket Modal State
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCall = () => {
    Linking.openURL('tel:05111187828').catch(() => {
      Alert.alert('Helpline', 'Call 051-111-87828 (USTAVIA)');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@ustavia.pk?subject=Ustavia%20Support%20Request').catch(() => {
      Alert.alert('Email Support', 'Contact us at support@ustavia.pk');
    });
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/923001234567?text=Hello%20Ustavia%20Support').catch(() => {
      Alert.alert('WhatsApp', 'WhatsApp us at +92 300 1234567');
    });
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Required Fields', 'Please fill in both the subject and details of your request.');
      return;
    }
    const generated = `UST-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generated);
    setTicketSuccess(true);
  };

  const handleCloseModal = () => {
    setTicketModalVisible(false);
    setTicketSuccess(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View
        style={[
          styles.headerBanner,
          {
            backgroundColor: colors.brandBlue,
            borderRadius: radii.xl,
            padding: spacing.xl,
          },
          shadows.md,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LifeBuoy size={28} color={colors.white} />
          <Text
            style={{
              color: colors.white,
              fontFamily: typography.headingWeights.bold,
              fontSize: 22,
            }}
          >
            Ustavia Help Center
          </Text>
        </View>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, marginTop: 6, lineHeight: 18 }}>
          Instant answers, 24/7 helpline, and fast support dispute resolution.
        </Text>

        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.white,
              borderRadius: radii.lg,
              marginTop: spacing.lg,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search FAQs, warranties, payments..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Quick Contact Action Cards */}
      <Text
        style={[
          styles.sectionHeading,
          {
            color: colors.textPrimary,
            fontFamily: typography.headingWeights.bold,
            fontSize: typography.size.md,
            marginTop: spacing.xl,
            marginBottom: spacing.sm,
          },
        ]}
      >
        Reach Our Support Team
      </Text>

      <View style={styles.contactRow}>
        <Pressable
          onPress={handleCall}
          style={[
            styles.contactTile,
            {
              backgroundColor: colors.white,
              borderColor: colors.border,
              borderRadius: radii.lg,
              padding: spacing.md,
            },
            shadows.sm,
          ]}
        >
          <View style={[styles.contactIconWrap, { backgroundColor: '#E0F2FE', borderRadius: radii.full }]}>
            <PhoneCall size={20} color={colors.brandBlue} />
          </View>
          <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 13, marginTop: 8 }}>
            Call Helpline
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>051-111-87828</Text>
        </Pressable>

        <Pressable
          onPress={handleWhatsApp}
          style={[
            styles.contactTile,
            {
              backgroundColor: colors.white,
              borderColor: colors.border,
              borderRadius: radii.lg,
              padding: spacing.md,
            },
            shadows.sm,
          ]}
        >
          <View style={[styles.contactIconWrap, { backgroundColor: '#DCFCE7', borderRadius: radii.full }]}>
            <MessageSquare size={20} color="#16A34A" />
          </View>
          <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 13, marginTop: 8 }}>
            WhatsApp Desk
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>Instant Response</Text>
        </Pressable>

        <Pressable
          onPress={handleEmail}
          style={[
            styles.contactTile,
            {
              backgroundColor: colors.white,
              borderColor: colors.border,
              borderRadius: radii.lg,
              padding: spacing.md,
            },
            shadows.sm,
          ]}
        >
          <View style={[styles.contactIconWrap, { backgroundColor: '#FEF3C7', borderRadius: radii.full }]}>
            <Mail size={20} color="#D97706" />
          </View>
          <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 13, marginTop: 8 }}>
            Email Support
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>support@ustavia.pk</Text>
        </Pressable>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.categoryScroll, { marginVertical: spacing.lg }]}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? colors.brandBlue : colors.white,
                  borderColor: isSelected ? colors.brandBlue : colors.border,
                  borderRadius: radii.full,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? colors.white : colors.textSecondary,
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: 12,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Accordion FAQs */}
      <View style={{ gap: spacing.sm }}>
        {filteredFaqs.length === 0 ? (
          <View style={[styles.emptyBox, { padding: spacing.xl }]}>
            <HelpCircle size={32} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: 14 }}>
              No matching help articles found.
            </Text>
          </View>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <View
                key={faq.id}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: colors.white,
                    borderColor: isExpanded ? colors.brandBlue : colors.border,
                    borderRadius: radii.lg,
                  },
                  shadows.sm,
                ]}
              >
                <Pressable
                  onPress={() => setExpandedId(isExpanded ? null : faq.id)}
                  style={[styles.faqHeader, { padding: spacing.md }]}
                >
                  <Text
                    style={{
                      flex: 1,
                      color: colors.textPrimary,
                      fontFamily: typography.headingWeights.semibold,
                      fontSize: 14,
                      paddingRight: spacing.sm,
                    }}
                  >
                    {faq.question}
                  </Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={colors.brandBlue} />
                  ) : (
                    <ChevronDown size={18} color={colors.textSecondary} />
                  )}
                </Pressable>

                {isExpanded && (
                  <View
                    style={[
                      styles.faqBody,
                      {
                        borderTopColor: colors.borderSubtle,
                        padding: spacing.md,
                        backgroundColor: '#FAFAFA',
                      },
                    ]}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 19 }}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Open Ticket CTA Box */}
      <View
        style={[
          styles.ticketBanner,
          {
            backgroundColor: '#EFF6FF',
            borderColor: '#BFDBFE',
            borderRadius: radii.xl,
            padding: spacing.lg,
            marginTop: spacing.xl,
            marginBottom: spacing.xxl,
          },
        ]}
      >
        <ShieldCheck size={28} color={colors.brandBlue} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={{ color: colors.brandBlueDark, fontWeight: '700', fontSize: 15 }}>
            Have a custom dispute or complaint?
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2, lineHeight: 16 }}>
            Submit a priority ticket and an Ustavia Support Supervisor will review it within 2 hours.
          </Text>
        </View>
        <View style={{ marginTop: spacing.md, width: '100%' }}>
          <Button
            label="Open Priority Support Ticket"
            variant="outline"
            onPress={() => setTicketModalVisible(true)}
          />
        </View>
      </View>

      {/* Ticket Modal */}
      <Modal
        visible={ticketModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.white,
                borderRadius: radii.xl,
                padding: spacing.xl,
              },
              shadows.lg,
            ]}
          >
            {ticketSuccess ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
                <CheckCircle2 size={54} color={colors.success} strokeWidth={2.2} />
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontFamily: typography.headingWeights.bold,
                    fontSize: 20,
                    marginTop: spacing.md,
                  }}
                >
                  Ticket Submitted
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 6 }}>
                  Your support case has been logged. Our rapid assistance team is assigned.
                </Text>
                <View
                  style={[
                    styles.ticketIdBadge,
                    {
                      backgroundColor: colors.brandBlueLight,
                      borderRadius: radii.md,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      marginVertical: spacing.lg,
                    },
                  ]}
                >
                  <Text style={{ color: colors.brandBlueDark, fontWeight: '800', fontSize: 16 }}>
                    Ticket ID: #{ticketId}
                  </Text>
                </View>
                <Button label="Done" onPress={handleCloseModal} />
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontFamily: typography.headingWeights.bold,
                      fontSize: 18,
                    }}
                  >
                    Open Support Ticket
                  </Text>
                  <Pressable onPress={handleCloseModal}>
                    <X size={20} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                  Explain your issue and an incident manager will follow up.
                </Text>

                <View style={{ marginTop: spacing.md }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13, marginBottom: 6 }}>
                    Subject / Category
                  </Text>
                  <TextInput
                    style={[
                      styles.modalInput,
                      {
                        borderColor: colors.border,
                        borderRadius: radii.md,
                        paddingHorizontal: spacing.md,
                        color: colors.textPrimary,
                      },
                    ]}
                    placeholder="e.g. Escrow payment not released, No-show"
                    placeholderTextColor={colors.textSecondary}
                    value={ticketSubject}
                    onChangeText={setTicketSubject}
                  />
                </View>

                <View style={{ marginTop: spacing.md }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13, marginBottom: 6 }}>
                    Detailed Description
                  </Text>
                  <TextInput
                    style={[
                      styles.modalTextArea,
                      {
                        borderColor: colors.border,
                        borderRadius: radii.md,
                        padding: spacing.md,
                        color: colors.textPrimary,
                      },
                    ]}
                    placeholder="Provide details, job ID or transaction details..."
                    placeholderTextColor={colors.textSecondary}
                    value={ticketMessage}
                    onChangeText={setTicketMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={{ marginTop: spacing.xl }}>
                  <Button
                    label="Submit Ticket"
                    icon={Send}
                    onPress={handleSubmitTicket}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerBanner: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 13,
  },
  sectionHeading: {},
  contactRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactTile: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
  contactIconWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqBody: {
    borderTopWidth: 1,
  },
  ticketBanner: {
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    fontSize: 14,
  },
  modalTextArea: {
    height: 100,
    borderWidth: 1,
    fontSize: 14,
  },
  ticketIdBadge: {},
});
