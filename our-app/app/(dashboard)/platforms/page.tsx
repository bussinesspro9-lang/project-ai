'use client'

import { motion } from 'framer-motion'
import {
  Text,
  Stack,
  SimpleGrid,
  Paper,
  Badge,
  Button,
  Group,
  Box,
  ActionIcon,
  Tooltip,
  Loader,
  Center,
} from '@mantine/core'
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandWhatsapp,
  IconPlugConnected,
  IconCheck,
  IconX,
  IconRefresh,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
  usePlatformsControllerGetAllConnections,
  usePlatformsControllerConnect,
  usePlatformsControllerDisconnect,
} from '@businesspro/api-client'
import { useQueryClient } from '@tanstack/react-query'

const platformMeta: Record<string, { icon: typeof IconBrandInstagram; color: string; name: string; description: string; features: string[] }> = {
  instagram: {
    icon: IconBrandInstagram,
    color: 'pink',
    name: 'Instagram',
    description: 'Post content, stories, and reels. Manage comments and DMs.',
    features: ['Auto-publish posts', 'Story scheduling', 'Comment management', 'Hashtag optimization'],
  },
  facebook: {
    icon: IconBrandFacebook,
    color: 'blue',
    name: 'Facebook',
    description: 'Manage your Facebook page, posts, and audience engagement.',
    features: ['Page post publishing', 'Event promotion', 'Comment responses', 'Audience insights'],
  },
  'google-business': {
    icon: IconBrandGoogle,
    color: 'orange',
    name: 'Google Business',
    description: 'Manage your Google Business Profile, reviews, and posts.',
    features: ['Review management', 'Business posts', 'Q&A responses', 'Photo uploads'],
  },
  whatsapp: {
    icon: IconBrandWhatsapp,
    color: 'green',
    name: 'WhatsApp Business',
    description: 'Share content directly via WhatsApp with deep links.',
    features: ['Content sharing', 'Status updates', 'Broadcast lists', 'Quick replies'],
  },
}

const PLATFORM_ORDER = ['instagram', 'facebook', 'google-business', 'whatsapp']

export default function PlatformsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = usePlatformsControllerGetAllConnections() as any
  const connectMutation = usePlatformsControllerConnect()
  const disconnectMutation = usePlatformsControllerDisconnect()

  const connections: any[] = data ?? []

  const connectedIds = new Set(
    connections
      .filter((c: any) => c.connected || c.isConnected || c.status === 'connected')
      .map((c: any) => c.platform ?? c.id),
  )

  const platforms = PLATFORM_ORDER.map((id) => {
    const conn = connections.find((c: any) => (c.platform ?? c.id) === id)
    const meta = platformMeta[id]
    return {
      id,
      ...meta,
      connected: connectedIds.has(id),
      lastSynced: conn?.lastSynced ?? conn?.lastSyncedAt,
    }
  })

  const connectedCount = platforms.filter((p) => p.connected).length

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  }

  const handleConnect = (platformId: string) => {
    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    ).replace('/api/v1', '')

    if (platformId === 'instagram' || platformId === 'facebook') {
      window.location.href = `${apiUrl}/api/v1/platforms/connect/${platformId}`
      return
    }
    if (platformId === 'google-business') {
      window.location.href = `${apiUrl}/api/v1/platforms/connect/google`
      return
    }

    connectMutation.mutate(
      { platform: platformId },
      {
        onSuccess: () => {
          notifications.show({ title: 'Connected', message: `${platformMeta[platformId]?.name} connected`, color: 'green' })
          invalidate()
        },
        onError: () => {
          notifications.show({ title: 'Coming soon', message: 'Direct WhatsApp integration will be available soon', color: 'blue' })
        },
      },
    )
  }

  const handleDisconnect = (platformId: string) => {
    disconnectMutation.mutate(
      { platform: platformId },
      {
        onSuccess: () => {
          notifications.show({ title: 'Disconnected', message: 'Platform has been disconnected', color: 'gray' })
          invalidate()
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Failed to disconnect', color: 'red' })
        },
      },
    )
  }

  if (isLoading) {
    return <Center h={400}><Loader color="violet" size="lg" /></Center>
  }

  if (error) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Text c="red" fw={500}>Failed to load platforms</Text>
          <Button variant="light" color="violet" onClick={() => window.location.reload()}>Retry</Button>
        </Stack>
      </Center>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Stack gap={4} mb="xl">
          <Group gap="sm">
            <Text size="xl" fw={700} className="text-foreground">
              Connected Platforms
            </Text>
            <Badge size="lg" variant="light" color="violet">
              {connectedCount}/{platforms.length}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            Connect your social media accounts to publish content automatically
          </Text>
        </Stack>
      </motion.div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {platforms.map((platform, idx) => {
          const Icon = platform.icon

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Paper
                p="lg"
                radius="lg"
                withBorder
                className="bg-card h-full"
                style={{ borderTop: `3px solid var(--mantine-color-${platform.color}-5)` }}
              >
                <Group justify="space-between" mb="md">
                  <Group gap="sm">
                    <Box
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `var(--mantine-color-${platform.color}-1)` }}
                    >
                      <Icon size={24} style={{ color: `var(--mantine-color-${platform.color}-6)` }} />
                    </Box>
                    <Stack gap={2}>
                      <Text fw={600} size="md">{platform.name}</Text>
                      <Badge
                        size="xs"
                        variant="light"
                        color={platform.connected ? 'green' : 'gray'}
                        leftSection={platform.connected ? <IconCheck size={10} /> : <IconX size={10} />}
                      >
                        {platform.connected ? 'Connected' : 'Not connected'}
                      </Badge>
                    </Stack>
                  </Group>
                </Group>

                <Text size="sm" c="dimmed" mb="md">{platform.description}</Text>

                <Stack gap={4} mb="md">
                  {platform.features.map((feature) => (
                    <Group key={feature} gap="xs">
                      <IconCheck size={12} color="oklch(0.55 0.25 280)" style={{ flexShrink: 0 }} />
                      <Text size="xs" c="dimmed">{feature}</Text>
                    </Group>
                  ))}
                </Stack>

                {platform.lastSynced && (
                  <Text size="xs" c="dimmed" mb="sm">
                    Last synced: {typeof platform.lastSynced === 'string' && platform.lastSynced.includes('T')
                      ? new Date(platform.lastSynced).toLocaleString()
                      : platform.lastSynced}
                  </Text>
                )}

                <Group gap="sm">
                  {platform.connected ? (
                    <>
                      <Tooltip label="Sync now">
                        <ActionIcon variant="light" color={platform.color} radius="lg" size="lg">
                          <IconRefresh size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Button
                        variant="light"
                        color="red"
                        radius="lg"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        loading={disconnectMutation.isPending}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="gradient"
                      gradient={{ from: 'violet', to: 'indigo' }}
                      radius="lg"
                      leftSection={<IconPlugConnected size={16} />}
                      onClick={() => handleConnect(platform.id)}
                      loading={connectMutation.isPending}
                    >
                      Connect
                    </Button>
                  )}
                </Group>
              </Paper>
            </motion.div>
          )
        })}
      </SimpleGrid>
    </div>
  )
}
