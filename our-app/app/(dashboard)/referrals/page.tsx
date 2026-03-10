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
  CopyButton,
  TextInput,
  ActionIcon,
  Tooltip,
  Avatar,
  Loader,
  Center,
} from '@mantine/core'
import {
  IconGift,
  IconCopy,
  IconCheck,
  IconBrandWhatsapp,
  IconShare,
  IconUsers,
  IconCoins,
  IconLink,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useWhatsAppShare } from '@/hooks/use-whatsapp-share'
import {
  useReferralsControllerGetMyCode,
  useReferralsControllerGetStats,
} from '@businesspro/api-client'

const statusColors: Record<string, string> = {
  pending: 'gray',
  signed_up: 'blue',
  activated: 'teal',
  rewarded: 'green',
}

const statusLabels: Record<string, string> = {
  pending: 'Invite Sent',
  signed_up: 'Signed Up',
  activated: 'Active User',
  rewarded: 'Reward Given',
}

export default function ReferralsPage() {
  const { share: shareWhatsApp } = useWhatsAppShare()

  const { data: codeData, isLoading: loadingCode } = useReferralsControllerGetMyCode() as any
  const { data: statsData, isLoading: loadingStats } = useReferralsControllerGetStats() as any

  const referralCode = codeData?.code ?? codeData?.referralCode ?? '---'
  const referralLink = codeData?.link ?? `https://businesspro.app/join/${referralCode}`

  const totalReferred = statsData?.totalReferred ?? statsData?.invitesSent ?? 0
  const rewardedCount = statsData?.rewardedCount ?? statsData?.successfulReferrals ?? 0
  const totalFreeDaysEarned = statsData?.totalFreeDaysEarned ?? rewardedCount * 7
  const referrals: any[] = statsData?.referrals ?? statsData?.history ?? []

  const isLoading = loadingCode || loadingStats

  const handleWhatsAppShare = () => {
    shareWhatsApp({
      text: `I've been using BusinessPro to manage my social media with AI - it's amazing! Join for free using my link and we both get 7 days of premium features:`,
      url: referralLink,
    })
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join BusinessPro',
          text: 'Manage your social media with AI! Join using my referral link.',
          url: referralLink,
        })
      } catch {
        // user cancelled
      }
    } else {
      notifications.show({
        title: 'Link Copied',
        message: 'Share link has been copied',
        color: 'green',
      })
    }
  }

  if (isLoading) {
    return <Center h={400}><Loader color="violet" size="lg" /></Center>
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Stack gap={4} mb="xl">
          <Text size="xl" fw={700} className="text-foreground">
            Refer & Earn
          </Text>
          <Text size="sm" c="dimmed">
            Invite businesses and earn free premium days for each successful referral
          </Text>
        </Stack>
      </motion.div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Paper p="lg" radius="lg" withBorder className="bg-card text-center">
            <Box className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-sm">
              <IconUsers size={24} className="text-primary" />
            </Box>
            <Text size="2rem" fw={700} className="text-foreground">{totalReferred}</Text>
            <Text size="xs" c="dimmed" fw={500}>People Invited</Text>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <Paper p="lg" radius="lg" withBorder className="bg-card text-center">
            <Box className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 mx-auto mb-sm">
              <IconCheck size={24} color="var(--mantine-color-green-6)" />
            </Box>
            <Text size="2rem" fw={700} className="text-foreground">{rewardedCount}</Text>
            <Text size="xs" c="dimmed" fw={500}>Successful Referrals</Text>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Paper p="lg" radius="lg" withBorder className="bg-card text-center">
            <Box className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-sm" style={{ backgroundColor: 'var(--mantine-color-yellow-1)' }}>
              <IconCoins size={24} color="var(--mantine-color-yellow-6)" />
            </Box>
            <Text size="2rem" fw={700} className="text-foreground">{totalFreeDaysEarned}</Text>
            <Text size="xs" c="dimmed" fw={500}>Free Days Earned</Text>
          </Paper>
        </motion.div>
      </SimpleGrid>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Paper
          p="xl"
          radius="lg"
          withBorder
          className="bg-card mb-xl"
          style={{
            background: 'linear-gradient(135deg, oklch(0.55 0.25 280 / 0.05), oklch(0.65 0.2 280 / 0.05))',
          }}
          mb="xl"
        >
          <Stack gap="md" align="center">
            <Box className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <IconGift size={32} className="text-primary" />
            </Box>
            <Stack gap={4} align="center">
              <Text fw={700} size="lg">Your Referral Link</Text>
              <Text size="sm" c="dimmed" ta="center">
                Share your unique link. You both get 7 free premium days!
              </Text>
            </Stack>

            <Group gap="xs" style={{ width: '100%', maxWidth: 500 }}>
              <TextInput
                value={referralLink}
                readOnly
                radius="lg"
                style={{ flex: 1 }}
                leftSection={<IconLink size={16} />}
                styles={{ input: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
              />
              <CopyButton value={referralLink}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
                    <ActionIcon
                      variant="light"
                      color={copied ? 'green' : 'violet'}
                      size="lg"
                      radius="lg"
                      onClick={copy}
                    >
                      {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>

            <Group gap="sm">
              <Button
                variant="gradient"
                gradient={{ from: 'green.6', to: 'green.8' }}
                leftSection={<IconBrandWhatsapp size={18} />}
                radius="lg"
                size="md"
                onClick={handleWhatsAppShare}
              >
                Share on WhatsApp
              </Button>
              <Button
                variant="light"
                color="violet"
                leftSection={<IconShare size={16} />}
                radius="lg"
                onClick={handleNativeShare}
              >
                Share Link
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              Referral Code: <Text component="span" fw={700}>{referralCode}</Text>
            </Text>
          </Stack>
        </Paper>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Paper p="lg" radius="lg" withBorder className="bg-card">
          <Text fw={600} size="md" mb="md">Referral History</Text>

          {referrals.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="lg">
              No referrals yet. Share your link to get started!
            </Text>
          ) : (
            <Stack gap="sm">
              {referrals.map((referral: any, idx: number) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                >
                  <Paper p="sm" radius="md" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl" color={statusColors[referral.status] || 'gray'}>
                          {referral.refereeName
                            ? referral.refereeName.charAt(0)
                            : '?'}
                        </Avatar>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {referral.refereeName || 'Pending invite'}
                          </Text>
                          <Group gap="xs">
                            <Badge
                              size="xs"
                              variant="light"
                              color={statusColors[referral.status] || 'gray'}
                            >
                              {statusLabels[referral.status] || referral.status}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              via {referral.channel}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>

                      <Stack gap={2} align="flex-end">
                        <Text size="xs" c="dimmed">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </Text>
                        {referral.status === 'rewarded' && (
                          <Badge size="xs" variant="filled" color="green">
                            +{referral.rewardValue} days
                          </Badge>
                        )}
                      </Stack>
                    </Group>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          )}
        </Paper>
      </motion.div>
    </div>
  )
}
