'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Text,
  Stack,
  Paper,
  Badge,
  Button,
  Group,
  Tabs,
  Avatar,
  ActionIcon,
  Tooltip,
  Textarea,
  Modal,
  Loader,
  Center,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconInbox,
  IconMessageCircle,
  IconStar,
  IconStarFilled,
  IconSend,
  IconRobot,
  IconX,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
  useEngagementControllerFindAll,
  useEngagementControllerRespond,
  useEngagementControllerSkip,
  useEngagementControllerGetStats,
} from '@businesspro/api-client'
import { useQueryClient } from '@tanstack/react-query'

const platformIcons: Record<string, typeof IconBrandInstagram> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  google: IconBrandGoogle,
  whatsapp: IconBrandWhatsapp,
}

const sentimentColors: Record<string, string> = {
  positive: 'green',
  neutral: 'gray',
  negative: 'red',
}

const typeLabels: Record<string, string> = {
  review: 'Review',
  comment: 'Comment',
  dm: 'Direct Message',
  mention: 'Mention',
  suggested_comment: 'AI Suggestion',
}

export default function InboxPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<string | null>('all')
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [opened, { open, close }] = useDisclosure(false)

  const { data, isLoading, error } = useEngagementControllerFindAll() as any
  const { data: stats } = useEngagementControllerGetStats() as any
  const respondMutation = useEngagementControllerRespond()
  const skipMutation = useEngagementControllerSkip()

  const interactions: any[] = data?.data ?? data ?? []
  const filtered = activeTab === 'all'
    ? interactions
    : interactions.filter((i: any) => i.type === activeTab)

  const pendingCount = stats?.pending ?? interactions.filter(
    (i: any) => i.responseStatus === 'pending',
  ).length

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['engagement'] })
  }

  const handleRespond = (interaction: any) => {
    setSelectedInteraction(interaction)
    setReplyText(interaction.aiSuggestedResponse || '')
    open()
  }

  const handleSend = () => {
    if (!selectedInteraction) return
    respondMutation.mutate(
      { id: selectedInteraction.id } as any,
      {
        onSuccess: () => {
          notifications.show({
            title: 'Response Sent!',
            message: `Reply sent to ${selectedInteraction.externalUserName}`,
            color: 'green',
          })
          close()
          setReplyText('')
          invalidate()
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Failed to send reply', color: 'red' })
        },
      },
    )
  }

  const handleSkip = (id: number) => {
    skipMutation.mutate(
      { id } as any,
      {
        onSuccess: () => {
          notifications.show({ title: 'Skipped', message: 'Interaction skipped', color: 'gray' })
          invalidate()
        },
      },
    )
  }

  const handleUseAI = () => {
    if (selectedInteraction?.aiSuggestedResponse) {
      setReplyText(selectedInteraction.aiSuggestedResponse)
    }
  }

  if (isLoading) {
    return <Center h={400}><Loader color="violet" size="lg" /></Center>
  }

  if (error) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Text c="red" fw={500}>Failed to load inbox</Text>
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
        <Group justify="space-between" mb="xl">
          <Stack gap={4}>
            <Group gap="sm">
              <Text size="xl" fw={700} className="text-foreground">
                Engagement Inbox
              </Text>
              {pendingCount > 0 && (
                <Badge size="lg" variant="filled" color="violet" circle>
                  {pendingCount}
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              All your reviews, comments, and messages in one place
            </Text>
          </Stack>
        </Group>
      </motion.div>

      <Tabs value={activeTab} onChange={setActiveTab} radius="lg" mb="lg">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="review">Reviews</Tabs.Tab>
          <Tabs.Tab value="comment">Comments</Tabs.Tab>
          <Tabs.Tab value="dm">Messages</Tabs.Tab>
          <Tabs.Tab value="mention">Mentions</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Stack gap="sm">
        {filtered.map((interaction: any, idx: number) => {
          const PlatformIcon =
            platformIcons[interaction.platform] || IconMessageCircle

          return (
            <motion.div
              key={interaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Paper
                p="md"
                radius="lg"
                withBorder
                className="bg-card"
                style={{
                  borderLeft: `4px solid var(--mantine-color-${sentimentColors[interaction.sentiment] || 'gray'}-5)`,
                }}
              >
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
                    <Avatar
                      size="md"
                      radius="xl"
                      color={sentimentColors[interaction.sentiment] || 'gray'}
                    >
                      {(interaction.externalUserName || '?')
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </Avatar>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Text fw={600} size="sm">
                          {interaction.externalUserName}
                        </Text>
                        <Badge size="xs" variant="light" color="gray">
                          <Group gap={4}>
                            <PlatformIcon size={10} />
                            {interaction.platform}
                          </Group>
                        </Badge>
                        <Badge
                          size="xs"
                          variant="light"
                          color={sentimentColors[interaction.sentiment] || 'gray'}
                        >
                          {interaction.sentiment}
                        </Badge>
                        <Badge size="xs" variant="outline" color="gray">
                          {typeLabels[interaction.type] || interaction.type}
                        </Badge>
                        {interaction.rating && (
                          <Group gap={2}>
                            {Array.from({ length: 5 }).map((_, i) =>
                              i < (interaction.rating || 0) ? (
                                <IconStarFilled key={i} size={10} color="oklch(0.7 0.15 80)" />
                              ) : (
                                <IconStar key={i} size={10} style={{ opacity: 0.2 }} />
                              ),
                            )}
                          </Group>
                        )}
                      </Group>
                      <Text size="sm">{interaction.originalText}</Text>

                      {interaction.aiSuggestedResponse && (
                        <Paper p="xs" radius="md" className="bg-primary/5" mt={4}>
                          <Group gap={4} mb={4}>
                            <IconRobot size={12} className="text-primary" />
                            <Text size="10px" fw={600} className="text-primary">
                              AI Suggested Reply
                            </Text>
                          </Group>
                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {interaction.aiSuggestedResponse}
                          </Text>
                        </Paper>
                      )}

                      <Text size="xs" c="dimmed" mt={4}>
                        {new Date(interaction.createdAt).toLocaleString()}
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap={4}>
                    <Button
                      size="xs"
                      variant="light"
                      color="violet"
                      radius="lg"
                      leftSection={<IconSend size={12} />}
                      onClick={() => handleRespond(interaction)}
                    >
                      Reply
                    </Button>
                    <Tooltip label="Skip">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        radius="lg"
                        onClick={() => handleSkip(interaction.id)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            </motion.div>
          )
        })}
      </Stack>

      {filtered.length === 0 && (
        <Paper p="xl" radius="lg" withBorder className="bg-card">
          <Stack align="center" gap="md">
            <IconInbox size={48} style={{ opacity: 0.3 }} />
            <Text size="lg" fw={500} c="dimmed">
              All caught up!
            </Text>
            <Text size="sm" c="dimmed">
              No pending interactions
            </Text>
          </Stack>
        </Paper>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <IconSend size={18} className="text-primary" />
            <Text fw={600}>Reply to {selectedInteraction?.externalUserName}</Text>
          </Group>
        }
        size="lg"
        radius="lg"
      >
        {selectedInteraction && (
          <Stack gap="md">
            <Paper p="sm" radius="md" withBorder>
              <Text size="sm" fw={500} mb={4}>Original message:</Text>
              <Text size="sm" c="dimmed">{selectedInteraction.originalText}</Text>
            </Paper>

            <Textarea
              label="Your reply"
              placeholder="Type your response..."
              value={replyText}
              onChange={(e) => setReplyText(e.currentTarget.value)}
              minRows={4}
              radius="lg"
              autosize
            />

            <Group justify="space-between">
              <Button
                variant="light"
                color="violet"
                leftSection={<IconRobot size={16} />}
                radius="lg"
                onClick={handleUseAI}
              >
                Use AI Suggestion
              </Button>
              <Group gap="sm">
                <Button variant="light" color="gray" radius="lg" onClick={close}>
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'indigo' }}
                  leftSection={<IconSend size={16} />}
                  radius="lg"
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  loading={respondMutation.isPending}
                >
                  Send Reply
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  )
}
