'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TextInput,
  Button,
  Stack,
  Text,
  Anchor,
  Divider,
  Group,
  Box,
  Progress,
  PinInput,
  Select,
  Title,
  Paper,
  Badge,
} from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconPhone,
  IconBrandGoogle,
  IconSparkles,
  IconRocket,
  IconCheck,
  IconArrowLeft,
  IconBuildingStore,
  IconShieldCheck,
} from '@tabler/icons-react';
import { AuthLayout } from './AuthLayout';
import type { PhoneAuthProps } from '../types';

const DEFAULT_BUSINESS_TYPES = [
  { value: 'cafe', label: 'Cafe & Coffee Shop' },
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'salon', label: 'Salon & Spa' },
  { value: 'gym', label: 'Gym & Fitness' },
  { value: 'clinic', label: 'Clinic & Healthcare' },
  { value: 'boutique', label: 'Boutique & Fashion' },
  { value: 'kirana', label: 'Retail & Kirana Store' },
  { value: 'tea-shop', label: 'Tea & Juice Shop' },
];

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export function PhoneAuth({
  onSendOtp,
  onVerifyOtp,
  onSocialLogin,
  onEmailLoginClick,
  loading = false,
  businessTypes = DEFAULT_BUSINESS_TYPES,
  onBusinessTypeSelect,
  initialStep = 0,
}: PhoneAuthProps) {
  const [step, setStep] = useState(initialStep);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [demoLines, setDemoLines] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

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

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10) return 'Enter a valid 10-digit phone number';
    return '';
  };

  const handleSendOtp = async () => {
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    try {
      const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      await onSendOtp(formatted);
      setResendTimer(30);
      setStep(1);
    } catch (e: any) {
      setPhoneError(e?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit code');
      return;
    }
    setOtpError('');
    setIsLoading(true);
    try {
      const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      await onVerifyOtp(formatted, otp);
      setStep(2);
    } catch (e: any) {
      setOtpError(e?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      await onSendOtp(formatted);
      setResendTimer(30);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const demoTexts = [
    'Analyzing your business type...',
    'Finding trending content ideas...',
    'Generating your first Instagram caption...',
    'Adding relevant hashtags...',
    'Your AI content is ready!',
  ];

  const runAIDemo = useCallback(() => {
    setDemoLines([]);
    let i = 0;
    const timer = setInterval(() => {
      if (i < demoTexts.length) {
        setDemoLines((prev) => [...prev, demoTexts[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const handleBusinessSelect = async (type: string | null) => {
    if (!type) return;
    setSelectedBusiness(type);
    if (onBusinessTypeSelect) {
      try {
        await onBusinessTypeSelect(type);
      } catch {
        // non-blocking
      }
    }
    setStep(3);
    runAIDemo();
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return 'Get Started in Seconds';
      case 1: return 'Verify Your Phone';
      case 2: return 'What\'s Your Business?';
      case 3: return 'AI Magic in Action';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 0: return 'No signup forms. Just your phone number.';
      case 1: return `Enter the code sent to ${phone}`;
      case 2: return 'We\'ll tailor everything for you';
      case 3: return 'See what BusinessPro can do for you';
      default: return '';
    }
  };

  return (
    <AuthLayout title={getStepTitle()} subtitle={getStepSubtitle()} showLogo={step === 0}>
      <Box>
        <Progress
          value={progress}
          size="xs"
          radius="xl"
          mb="lg"
          color="violet"
          animated
        />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="phone" {...slideIn}>
              <Stack gap="md">
                <TextInput
                  placeholder="Enter your phone number"
                  leftSection={<Text size="sm" fw={500} c="dimmed">+91</Text>}
                  rightSection={<IconPhone size={18} style={{ opacity: 0.5 }} />}
                  radius="lg"
                  size="lg"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.currentTarget.value);
                    setPhoneError('');
                  }}
                  error={phoneError}
                  disabled={isLoading || loading}
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
                  loading={isLoading || loading}
                  gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
                  variant="gradient"
                  style={{ fontWeight: 600, height: '52px' }}
                >
                  Send OTP
                </Button>

                <Group gap="xs" justify="center">
                  <IconShieldCheck size={14} style={{ opacity: 0.5 }} />
                  <Text size="xs" c="dimmed">
                    We'll send a one-time code to verify
                  </Text>
                </Group>

                {onSocialLogin && (
                  <>
                    <Divider label="or" labelPosition="center" my="xs" />

                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconBrandGoogle size={20} />}
                      onClick={() => onSocialLogin('google')}
                      disabled={isLoading || loading}
                      radius="lg"
                      size="md"
                      color="gray"
                    >
                      Continue with Google
                    </Button>
                  </>
                )}

                {onEmailLoginClick && (
                  <Text size="sm" ta="center" mt="sm">
                    <Anchor
                      fw={500}
                      onClick={onEmailLoginClick}
                      style={{ color: 'oklch(0.55 0.25 280)' }}
                    >
                      Use email instead
                    </Anchor>
                  </Text>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Text size="xs" ta="center" mt="lg" c="dimmed" style={{ lineHeight: 1.6 }}>
                    Built with love by{' '}
                    <Text component="span" fw={600} c="violet">
                      Riya Tiwari
                    </Text>
                    <br />
                    <Text component="span" size="xs" c="dimmed">
                      Founder & CEO, Business Pro
                    </Text>
                  </Text>
                </motion.div>
              </Stack>
            </motion.div>
          )}

          {step === 1 && (
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
                  disabled={isLoading || loading}
                  oneTimeCode
                  autoFocus
                  styles={{
                    input: {
                      fontWeight: 600,
                      fontSize: '1.2rem',
                    },
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
                  loading={isLoading || loading}
                  gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
                  variant="gradient"
                  style={{ fontWeight: 600, height: '52px' }}
                  disabled={otp.length !== 6}
                >
                  Verify & Continue
                </Button>

                <Group gap="xs" justify="center">
                  <Text size="sm" c="dimmed">
                    Didn't receive it?
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
                    setStep(0);
                    setOtp('');
                    setOtpError('');
                  }}
                >
                  Change number
                </Button>
              </Stack>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="business" {...slideIn}>
              <Stack gap="sm">
                <Select
                  placeholder="Search your business type..."
                  data={businessTypes}
                  radius="lg"
                  size="lg"
                  searchable
                  leftSection={<IconBuildingStore size={20} />}
                  value={selectedBusiness}
                  onChange={handleBusinessSelect}
                  disabled={isLoading || loading}
                  styles={{
                    input: { fontWeight: 500 },
                  }}
                />

                <Text size="xs" c="dimmed" ta="center" mt="xs">
                  Or pick one
                </Text>

                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                  }}
                >
                  {businessTypes.slice(0, 8).map((bt) => (
                    <motion.div key={bt.value} whileTap={{ scale: 0.96 }}>
                      <Paper
                        p="sm"
                        radius="lg"
                        withBorder
                        onClick={() => handleBusinessSelect(bt.value)}
                        style={{
                          cursor: 'pointer',
                          border:
                            selectedBusiness === bt.value
                              ? '2px solid oklch(0.55 0.25 280)'
                              : undefined,
                          background:
                            selectedBusiness === bt.value
                              ? 'oklch(0.55 0.25 280 / 0.06)'
                              : undefined,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Text size="sm" fw={500} ta="center">
                          {bt.label}
                        </Text>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </Stack>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="demo" {...slideIn}>
              <Stack gap="lg" align="center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                >
                  <Box
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.65 0.2 280))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconRocket size={36} stroke={1.5} color="white" />
                  </Box>
                </motion.div>

                <Paper
                  p="md"
                  radius="lg"
                  withBorder
                  style={{ width: '100%' }}
                >
                  <Group gap="xs" mb="sm">
                    <IconSparkles size={16} color="oklch(0.55 0.25 280)" />
                    <Text size="sm" fw={600}>
                      AI is working...
                    </Text>
                    {selectedBusiness && (
                      <Badge size="sm" variant="light" color="violet">
                        {businessTypes.find((b) => b.value === selectedBusiness)?.label ||
                          selectedBusiness}
                      </Badge>
                    )}
                  </Group>

                  <Stack gap={6}>
                    {demoLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Group gap="xs" wrap="nowrap">
                          <IconCheck
                            size={14}
                            color="oklch(0.55 0.25 280)"
                            style={{ flexShrink: 0 }}
                          />
                          <Text size="sm" c="dimmed">
                            {line}
                          </Text>
                        </Group>
                      </motion.div>
                    ))}
                  </Stack>
                </Paper>

                {demoLines.length >= demoTexts.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    <Stack gap="sm">
                      <Title order={4} ta="center">
                        Your AI assistant is ready!
                      </Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Explore your dashboard and create your first content
                      </Text>

                      <Button
                        fullWidth
                        size="lg"
                        radius="lg"
                        onClick={() =>
                          (window.location.href = '/dashboard')
                        }
                        gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
                        variant="gradient"
                        style={{ fontWeight: 600, height: '52px', marginTop: '0.5rem' }}
                        rightSection={<IconSparkles size={18} />}
                      >
                        Go to Dashboard
                      </Button>
                    </Stack>
                  </motion.div>
                )}
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </AuthLayout>
  );
}
