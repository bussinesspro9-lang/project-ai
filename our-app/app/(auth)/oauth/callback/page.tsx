'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { setAuthTokens } from '@/lib/auth';
import { Center, Loader, Stack, Text } from '@mantine/core';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR/SSG issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const processOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('Missing authorization code');
        }

        // Exchange the one-time code for tokens via POST (tokens never appear in URL)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/v1/auth/oauth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const data = await response.json();

        setAuthTokens(data.accessToken, data.refreshToken);

        notifications.show({
          title: 'Welcome!',
          message: 'Successfully signed in with Google',
          color: 'green',
        });

        if (data.user?.onboardingCompleted === false) {
          router.push('/dashboard?showOnboarding=true');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);

        notifications.show({
          title: 'Authentication Failed',
          message: error instanceof Error ? error.message : 'Failed to complete sign in',
          color: 'red',
        });

        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, router, isMounted]);

  if (!isMounted) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" type="dots" color="violet" />
          <Text size="lg" fw={500}>
            Loading...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Stack align="center" gap="md">
        <Loader size="lg" type="dots" color="violet" />
        <Text size="lg" fw={500}>
          {isProcessing ? 'Completing sign in...' : 'Redirecting...'}
        </Text>
        <Text size="sm" c="dimmed">
          Please wait while we set up your account
        </Text>
      </Stack>
    </Center>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Center style={{ minHeight: '100vh' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" type="dots" color="violet" />
            <Text size="lg" fw={500}>
              Loading...
            </Text>
          </Stack>
        </Center>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
