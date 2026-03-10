'use client'

import { useState } from 'react'
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
  Select,
  Loader,
  Center,
  ActionIcon,
  Tooltip,
  Progress,
  Modal,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconCalendarStats,
  IconSparkles,
  IconCheck,
  IconX,
  IconClock,
  IconTrash,
  IconEye,
  IconCalendarEvent,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
  useContentPlansControllerFindAll,
  useContentPlansControllerGenerate,
  useContentPlansControllerApproveAll,
  useContentPlansControllerCancel,
  useContentPlansControllerUpdateItem,
} from '@businesspro/api-client'
import { useQueryClient } from '@tanstack/react-query'

const statusColors: Record<string, string> = {
  draft: 'gray',
  active: 'green',
  completed: 'blue',
  cancelled: 'red',
  suggested: 'yellow',
  approved: 'teal',
  rejected: 'red',
  published: 'violet',
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const platformColors: Record<string, string> = {
  instagram: 'pink',
  facebook: 'blue',
  whatsapp: 'green',
  'google-business': 'orange',
}

export default function ContentPlansPage() {
  const queryClient = useQueryClient()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const [genType, setGenType] = useState<string | null>('weekly')

  const { data, isLoading, error } = useContentPlansControllerFindAll() as any
  const generateMutation = useContentPlansControllerGenerate()
  const approveAllMutation = useContentPlansControllerApproveAll()
  const cancelMutation = useContentPlansControllerCancel()
  const updateItemMutation = useContentPlansControllerUpdateItem()

  const plans: any[] = data?.data ?? data ?? []

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['content-plans'] })
  }

  const handleGenerate = () => {
    generateMutation.mutate(
      { data: { type: genType || 'weekly' } } as any,
      {
        onSuccess: () => {
          notifications.show({
            title: 'Plan Generated!',
            message: `Your ${genType} content plan is ready for review`,
            color: 'green',
          })
          invalidate()
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Failed to generate plan', color: 'red' })
        },
      },
    )
  }

  const handleApproveAll = (planId: number) => {
    approveAllMutation.mutate(
      { id: planId },
      {
        onSuccess: () => {
          notifications.show({ title: 'Approved!', message: 'All items approved', color: 'green' })
          invalidate()
        },
      },
    )
  }

  const handleCancel = (planId: number) => {
    cancelMutation.mutate(
      { id: planId },
      {
        onSuccess: () => {
          notifications.show({ title: 'Cancelled', message: 'Plan has been cancelled', color: 'gray' })
          invalidate()
        },
      },
    )
  }

  const handleItemAction = (planId: number, itemId: number, status: string) => {
    updateItemMutation.mutate(
      { planId, itemId, data: { status } } as any,
      {
        onSuccess: () => {
          notifications.show({ title: 'Updated', message: `Item ${status}`, color: 'green' })
          invalidate()
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
          <Text c="red" fw={500}>Failed to load content plans</Text>
          <Button variant="light" color="violet" onClick={() => window.location.reload()}>Retry</Button>
        </Stack>
      </Center>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Group justify="space-between" mb="xl" wrap="wrap">
          <Stack gap={4}>
            <Text size="xl" fw={700} className="text-foreground">
              AI Content Planner
            </Text>
            <Text size="sm" c="dimmed">
              Auto-generate weekly or monthly content plans powered by AI
            </Text>
          </Stack>

          <Group gap="sm">
            <Select
              data={[
                { value: 'weekly', label: 'Weekly Plan' },
                { value: 'monthly', label: 'Monthly Plan' },
              ]}
              value={genType}
              onChange={setGenType}
              size="sm"
              radius="lg"
              w={150}
            />
            <Button
              leftSection={<IconSparkles size={16} />}
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo' }}
              radius="lg"
              onClick={handleGenerate}
              loading={generateMutation.isPending}
            >
              Generate Plan
            </Button>
          </Group>
        </Group>
      </motion.div>

      {plans.length === 0 && (
        <Paper p="xl" radius="lg" withBorder className="bg-card">
          <Stack align="center" gap="md">
            <IconCalendarStats size={48} style={{ opacity: 0.3 }} />
            <Text size="lg" fw={500} c="dimmed">No content plans yet</Text>
            <Text size="sm" c="dimmed">Generate your first AI-powered content plan above</Text>
          </Stack>
        </Paper>
      )}

      <Stack gap="lg">
        {plans.map((plan: any, idx: number) => {
          const items = plan.items ?? []
          const approvedCount = items.filter(
            (i: any) => i.status === 'approved' || i.status === 'published',
          ).length
          const progress = items.length > 0 ? (approvedCount / items.length) * 100 : 0

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Paper p="lg" radius="lg" withBorder className="bg-card">
                <Group justify="space-between" mb="md">
                  <Group gap="sm">
                    <Box className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconCalendarStats size={20} className="text-primary" />
                    </Box>
                    <Stack gap={2}>
                      <Group gap="xs">
                        <Text fw={600} size="md">
                          {plan.type === 'weekly' ? 'Weekly' : 'Monthly'} Plan
                        </Text>
                        <Badge size="sm" variant="light" color={statusColors[plan.status] || 'gray'}>
                          {plan.status}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {plan.startDate} to {plan.endDate} &middot; {items.length} posts
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="xs">
                    <Tooltip label="View details">
                      <ActionIcon
                        variant="light"
                        color="violet"
                        radius="lg"
                        onClick={() => { setSelectedPlan(plan); open() }}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Approve all">
                      <ActionIcon
                        variant="light"
                        color="green"
                        radius="lg"
                        onClick={() => handleApproveAll(plan.id)}
                        loading={approveAllMutation.isPending}
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Cancel plan">
                      <ActionIcon
                        variant="light"
                        color="red"
                        radius="lg"
                        onClick={() => handleCancel(plan.id)}
                        loading={cancelMutation.isPending}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Progress value={progress} size="sm" radius="xl" color="violet" mb="md" />
                <Text size="xs" c="dimmed" mb="md">
                  {approvedCount}/{items.length} posts approved
                </Text>

                <SimpleGrid cols={{ base: 2, sm: 3, md: 5, lg: 7 }} spacing="xs">
                  {items.slice(0, 7).map((item: any) => (
                    <Paper
                      key={item.id}
                      p="xs"
                      radius="md"
                      withBorder
                      style={{
                        borderLeft: `3px solid var(--mantine-color-${platformColors[item.platform] || 'gray'}-5)`,
                      }}
                    >
                      <Group gap={4} mb={4}>
                        <Text size="10px" fw={600} tt="uppercase" c="dimmed">
                          {dayNames[((item.day ?? 1) - 1) % 7]}
                        </Text>
                        <Badge size="xs" variant="dot" color={statusColors[item.status] || 'gray'}>
                          {item.status}
                        </Badge>
                      </Group>
                      <Text size="xs" lineClamp={2} c="dimmed">
                        {item.suggestedCaption}
                      </Text>
                      <Text size="10px" c="dimmed" mt={4}>
                        <IconClock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                        {item.timeSlot}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>

                {items.length > 7 && (
                  <Text size="xs" c="dimmed" ta="center" mt="sm">
                    +{items.length - 7} more posts
                  </Text>
                )}
              </Paper>
            </motion.div>
          )
        })}
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <IconCalendarEvent size={20} className="text-primary" />
            <Text fw={600}>Plan Details</Text>
          </Group>
        }
        size="xl"
        radius="lg"
      >
        {selectedPlan && (
          <Stack gap="md">
            {(selectedPlan.items ?? []).map((item: any) => (
              <Paper key={item.id} p="sm" radius="md" withBorder>
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Badge size="xs" color={platformColors[item.platform] || 'gray'}>
                        {item.platform}
                      </Badge>
                      <Badge size="xs" variant="light" color={statusColors[item.status] || 'gray'}>
                        {item.status}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        Day {item.day} at {item.timeSlot}
                      </Text>
                    </Group>
                    <Text size="sm">{item.suggestedCaption}</Text>
                  </Stack>
                  <Group gap={4}>
                    <ActionIcon
                      variant="light"
                      color="green"
                      size="sm"
                      radius="lg"
                      onClick={() => handleItemAction(selectedPlan.id, item.id, 'approved')}
                    >
                      <IconCheck size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      radius="lg"
                      onClick={() => handleItemAction(selectedPlan.id, item.id, 'rejected')}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Modal>
    </div>
  )
}
