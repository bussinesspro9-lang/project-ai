'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  Button,
  Stack,
  Text,
  Anchor,
  Divider,
  Group,
  Box,
  PinInput,
} from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconPhone,
  IconBrandGoogle,
  IconShieldCheck,
  IconArrowLeft,
} from '@tabler/icons-react';
import { AuthLayout } from '@businesspro/auth-ui';
import { notifications } from '@mantine/notifications';
import { setAuthTokens } from '@/lib/auth';
import {
  useAuthControllerSendPhoneOtp,
  useAuthControllerVerifyPhoneOtp,
} from '@businesspro/api-client';

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendOtpMutation = useAuthControllerSendPhoneOtp();
  const verifyOtpMutation = useAuthControllerVerifyPhoneOtp();

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  useEffect(() => {
    if (resendTimer > 0) {
      const id = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(id);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      intervalRef.current = id;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resendTimer]);

  const formatPhone = (value: string) =>
    value.startsWith('+') ? value : `+91${value.replace(/\D/g, '')}`;

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setPhoneError('Enter a valid 10-digit phone number');
      return;
    }
    setPhoneError('');
    try {
      await sendOtpMutation.mutateAsync({ data: { phone: formatPhone(phone) } });
      setResendTimer(30);
      setStep('otp');
    } catch (e: any) {
      setPhoneError(e?.messages?.[0] || e?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit code');
      return;
    }
    setOtpError('');
    try {
      const response: any = await verifyOtpMutation.mutateAsync({
        data: { phone: formatPhone(phone), otp },
      });

      setAuthTokens(response.accessToken, response.refreshToken);

      if (response.isNewUser) {
        notifications.show({
          title: 'Welcome!',
          message: 'Let\'s set up your business profile',
          color: 'violet',
        });
        router.push('/signup');
      } else {
        notifications.show({
          title: 'Welcome back!',
          message: 'Good to see you again',
          color: 'green',
        });
        window.location.href = '/dashboard';
      }
    } catch (e: any) {
      setOtpError(e?.messages?.[0] || e?.message || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await sendOtpMutation.mutateAsync({ data: { phone: formatPhone(phone) } });
      setResendTimer(30);
    } catch {
      // silent
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
      'http://localhost:8000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <AuthLayout
      title={step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
      subtitle={
        step === 'phone'
          ? 'Enter your phone number to continue'
          : `Enter the code sent to ${phone}`
      }
      showLogo
    >
      <Box>
        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone" {...slideIn}>
              <Stack gap="md">
                <TextInput
                  placeholder="Enter your phone number"
                  leftSection={
                    <Text size="sm" fw={500} c="dimmed">
                      +91
                    </Text>
                  }
                  rightSection={<IconPhone size={18} style={{ opacity: 0.5 }} />}
                  radius="lg"
                  size="lg"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.currentTarget.value);
                    setPhoneError('');
                  }}
                  error={phoneError}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  styles={{
                    input: { fontSize: '1.1rem', letterSpacing: '0.5px' },
                  }}
                />

                <Button
                  fullWidth
                  size="lg"
                  radius="lg"
                  onClick={handleSendOtp}
                  loading={isLoading}
                  gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
                  variant="gradient"
                  style={{ fontWeight: 600, height: '52px' }}
                >
                  Send OTP
                </Button>

                <Group gap="xs" justify="center">
                  <IconShieldCheck size={14} style={{ opacity: 0.5 }} />
                  <Text size="xs" c="dimmed">
                    We&apos;ll send a one-time code to verify
                  </Text>
                </Group>

                <Divider label="or" labelPosition="center" my="xs" />

                <Button
                  fullWidth
                  variant="light"
                  leftSection={<IconBrandGoogle size={20} />}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  radius="lg"
                  size="md"
                  color="gray"
                >
                  Continue with Google
                </Button>

                <Text size="sm" ta="center" mt="sm">
                  Don&apos;t have an account?{' '}
                  <Anchor
                    fw={600}
                    onClick={() => router.push('/signup')}
                    style={{ color: 'oklch(0.55 0.25 280)' }}
                  >
                    Sign up
                  </Anchor>
                </Text>
              </Stack>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" {...slideIn}>
              <Stack gap="lg" align="center">
                <PinInput
                  length={6}
                  size="lg"
                  radius="lg"
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    setOtpError('');
                  }}
                  error={!!otpError}
                  disabled={isLoading}
                  oneTimeCode
                  autoFocus
                  styles={{
                    input: { fontWeight: 600, fontSize: '1.2rem' },
                  }}
                />

                {otpError && (
                  <Text size="sm" c="red" ta="center">
                    {otpError}
                  </Text>
                )}

                <Button
                  fullWidth
                  size="lg"
                  radius="lg"
                  onClick={handleVerifyOtp}
                  loading={isLoading}
                  gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
                  variant="gradient"
                  style={{ fontWeight: 600, height: '52px' }}
                  disabled={otp.length !== 6}
                >
                  Verify & Continue
                </Button>

                <Group gap="xs" justify="center">
                  <Text size="sm" c="dimmed">
                    Didn&apos;t receive it?
                  </Text>
                  {resendTimer > 0 ? (
                    <Text size="sm" c="dimmed">
                      Resend in {resendTimer}s
                    </Text>
                  ) : (
                    <Anchor
                      size="sm"
                      fw={600}
                      onClick={handleResendOtp}
                      style={{ color: 'oklch(0.55 0.25 280)' }}
                    >
                      Resend OTP
                    </Anchor>
                  )}
                </Group>

                <Button
                  variant="subtle"
                  color="gray"
                  size="sm"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setOtpError('');
                  }}
                >
                  Change number
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </AuthLayout>
  );
}
