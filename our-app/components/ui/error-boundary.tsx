'use client';

import React, { Component, type ReactNode } from 'react';
import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Center style={{ minHeight: '50vh', padding: 32 }}>
          <Stack align="center" gap="lg" maw={480}>
            <IconAlertTriangle size={48} color="var(--mantine-color-red-6)" />
            <Title order={3} ta="center">
              Something went wrong
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </Text>
            <Button variant="light" color="violet" onClick={this.handleReset}>
              Try Again
            </Button>
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}
