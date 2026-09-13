import type { NavigationProp } from '@react-navigation/native';

import type { ApiUser } from '../../../api/auth';
import type { AuthStackParamList } from '../../../navigation/types';

/**
 * The one branch every successful auth call (OTP verify, or password
 * login) needs to make, shared so `RolePickerScreen` and `LoginScreen`
 * don't each reimplement it slightly differently:
 *   - no password on the account yet -> prompt to set one (`SetPassword`
 *     carries `afterVerified` so that screen knows what to do once it's
 *     done: land in the app, or continue to KYC).
 *   - already has a password (a returning user who set one before) ->
 *     skip straight to the same KYC/app branch.
 * `setUser` already flips `isAuthenticated` for an already-`verified`
 * user, so there's nothing to do for that case beyond calling it.
 */
export function afterAuthSession(
  navigation: NavigationProp<AuthStackParamList>,
  setAccessToken: (token: string) => void,
  setUser: (user: ApiUser) => void,
  session: { accessToken: string; user: ApiUser },
): void {
  setAccessToken(session.accessToken);
  setUser(session.user);

  if (!session.user.passwordSet) {
    navigation.navigate('SetPassword', { afterVerified: session.user.verificationStatus === 'verified' });
    return;
  }
  if (session.user.verificationStatus !== 'verified') {
    navigation.navigate('KycUpload');
  }
}
