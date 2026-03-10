'use client';

import { useRouter } from 'next/navigation';
import { PhoneAuth } from '@businesspro/auth-ui';
import { notifications } from '@mantine/notifications';
import { setAuthTokens, getAccessToken } from '@/lib/auth';
import {
  useAuthControllerSendPhoneOtp,
  useAuthControllerVerifyPhoneOtp,
} from '@businesspro/api-client';

const BUSINESS_TYPES = [
  { value: 'cafe', label: 'Cafe & Coffee Shop' },
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'salon', label: 'Salon & Spa' },
  { value: 'gym', label: 'Gym & Fitness' },
  { value: 'clinic', label: 'Clinic & Healthcare' },
  { value: 'boutique', label: 'Boutique & Fashion' },
  { value: 'kirana', label: 'Retail & Kirana Store' },
  { value: 'tea-shop', label: 'Tea & Juice Shop' },
];

export default function SignupPage() {
  const router = useRouter();
  const existingToken = getAccessToken();

  const sendOtpMutation = useAuthControllerSendPhoneOtp();
  const verifyOtpMutation = useAuthControllerVerifyPhoneOtp();

  const handleSendOtp = async (phone: string) => {
    await sendOtpMutation.mutateAsync({ data: { phone } });
  };

  const handleVerifyOtp = async (phone: string, otp: string) => {
    const response: any = await verifyOtpMutation.mutateAsync({
      data: { phone, otp },
    });

    setAuthTokens(response.accessToken, response.refreshToken);

    notifications.show({
      title: 'Welcome!',
      message: 'Your account is ready',
      color: 'green',
    });
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
        'http://localhost:8000';
      window.location.href = `${apiUrl}/api/v1/auth/google`;
    } else {
      notifications.show({
        title: 'Coming soon',
        message: 'Facebook login will be available soon',
        color: 'blue',
      });
    }
  };

  const handleBusinessTypeSelect = async (type: string) => {
    const token = getAccessToken();
    if (!token) return;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    fetch(`${apiUrl}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ businessType: type }),
    }).catch(() => {});
  };

  return (
    <PhoneAuth
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onSocialLogin={handleSocialLogin}
      onEmailLoginClick={() => router.push('/login')}
      businessTypes={BUSINESS_TYPES}
      onBusinessTypeSelect={handleBusinessTypeSelect}
      loading={sendOtpMutation.isPending || verifyOtpMutation.isPending}
      initialStep={existingToken ? 2 : 0}
    />
  );
}
