import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  PhoneEntry: undefined;
  Otp: { phone: string };
  RolePicker: undefined;
  KycUpload: undefined;
  PendingVerification: undefined;
};

export type MazdoorTabsParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  Messages: undefined;
  Wallet: undefined;
  Settings: undefined;
};

export type CustomerTabsParamList = {
  PostJob: undefined;
  Scheduled: undefined;
  Messages: undefined;
  History: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<MazdoorTabsParamList | CustomerTabsParamList>;
  JobDetail: { jobId: string };
  Chat: { jobId: string };
  Sos: { jobId: string };
  PaymentMethod: { jobId: string };
  EscrowConfirm: { jobId: string; method: string };
  PaymentSuccess: { jobId: string };
  DisputeDetail: { jobId: string };
  Withdrawal: undefined;
  AddBankAccount: undefined;
};
