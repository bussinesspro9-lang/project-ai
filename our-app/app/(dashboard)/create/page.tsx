'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Text,
  Stack,
  Button,
  Group,
  Box,
  Select,
  Chip,
  Paper,
  Textarea,
  Badge,
  SimpleGrid,
  Tooltip,
} from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconSparkles,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconMapPin,
  IconTarget,
  IconCalendar,
  IconRocket,
  IconWand,
} from '@tabler/icons-react'
import { ContentPreview } from '@/components/create/content-preview'
import { ContentActions } from '@/components/content/content-actions'
import { useAppStore, type Platform } from '@/lib/store'
import { useContentControllerCreate } from '@businesspro/api-client'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

const PLATFORMS: { value: Platform; label: string; icon: typeof IconBrandInstagram; color: string }[] = [
  { value: 'instagram', label: 'Instagram', icon: IconBrandInstagram, color: 'pink' },
  { value: 'facebook', label: 'Facebook', icon: IconBrandFacebook, color: 'blue' },
  { value: 'whatsapp', label: 'WhatsApp', icon: IconBrandWhatsapp, color: 'green' },
  { value: 'google-business', label: 'Google', icon: IconMapPin, color: 'orange' },
]

const GOALS = [
  { value: 'promotion', label: 'Promote & Sell' },
  { value: 'engagement', label: 'Engage Audience' },
  { value: 'awareness', label: 'Build Awareness' },
  { value: 'festival', label: 'Festival Special' },
  { value: 'offer', label: 'Offer / Discount' },
]

export default function CreatePage() {
  const {
    createFlow,
    resetCreateFlow,
    updateCreateFlow,
    applySmartPreset,
  } = useAppStore()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const router = useRouter()
  const createContentMutation = useContentControllerCreate()

  useEffect(() => {
    if (createFlow.businessType && !createFlow.tone) {
      applySmartPreset(createFlow.businessType)
    }
  }, [createFlow.businessType])

  const isReadyToGenerate =
    createFlow.businessType &&
    createFlow.platforms.length > 0 &&
    createFlow.contentGoal

  const handleSaveAsDraft = async () => {
    if (!createFlow.generatedCaption) {
      notifications.show({
        title: 'Generate First',
        message: 'Generate content before saving',
        color: 'yellow',
      })
      return
    }

    try {
      await createContentMutation.mutateAsync({
        data: {
          caption: createFlow.generatedCaption,
          hashtags: createFlow.generatedHashtags,
          platform: createFlow.platforms[0] as any,
          status: 'draft' as any,
          businessType: createFlow.businessType as any,
          contentGoal: createFlow.contentGoal as any,
          tone: createFlow.tone as any,
          language: createFlow.language as any,
          visualStyle: createFlow.visualStyle as any,
        },
      })

      notifications.show({
        title: 'Saved!',
        message: 'Content saved as draft',
        color: 'green',
      })

      resetCreateFlow()
      router.push('/content')
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to save content',
        color: 'red',
      })
    }
  }

  const handleSchedule = async () => {
    if (!createFlow.generatedCaption || !createFlow.scheduledDate) {
      notifications.show({
        title: 'Missing Details',
        message: 'Generate content and pick a date first',
        color: 'yellow',
      })
      return
    }

    try {
      const scheduledFor = createFlow.scheduledTime
        ? new Date(
            `${createFlow.scheduledDate.toISOString().split('T')[0]}T${createFlow.scheduledTime}`,
          ).toISOString()
        : createFlow.scheduledDate.toISOString()

      await createContentMutation.mutateAsync({
        data: {
          caption: createFlow.generatedCaption,
          hashtags: createFlow.generatedHashtags,
          platform: createFlow.platforms[0] as any,
          status: 'scheduled' as any,
          businessType: createFlow.businessType as any,
          contentGoal: createFlow.contentGoal as any,
          tone: createFlow.tone as any,
          language: createFlow.language as any,
          visualStyle: createFlow.visualStyle as any,
          scheduledFor,
        },
      })

      notifications.show({
        title: 'Scheduled!',
        message: 'Content scheduled successfully',
        color: 'green',
      })

      resetCreateFlow()
      router.push('/calendar')
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to schedule content',
        color: 'red',
      })
    }
  }

  const togglePlatform = (platform: Platform) => {
    const current = createFlow.platforms
    updateCreateFlow({
      platforms: current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform],
    })
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="shrink-0"
      >
        <Group justify="space-between" mb="md">
          <Stack gap={4}>
            <Text size="xl" fw={700} className="text-foreground">
              Create Content
            </Text>
            <Text size="sm" c="dimmed" className="hidden lg:block">
              3 simple steps - What, Where & When
            </Text>
          </Stack>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={resetCreateFlow}
          >
            Reset
          </Button>
        </Group>
      </motion.div>

      <Box className="flex gap-6 flex-1 min-h-0">
        {/* Left: Settings Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`${isMobile ? 'w-full' : 'w-80 xl:w-96'} shrink-0 overflow-y-auto`}
        >
          <Stack gap="md">
            {/* Step 1: What to post */}
            <Paper p="md" radius="lg" withBorder className="bg-card">
              <Group gap="xs" mb="sm">
                <Badge size="lg" variant="filled" color="violet" circle>
                  1
                </Badge>
                <Text fw={600} size="sm">
                  What to post?
                </Text>
              </Group>

              <Stack gap="sm">
                <Select
                  placeholder="Your business type"
                  data={[
                    { value: 'cafe', label: 'Cafe & Coffee' },
                    { value: 'restaurant', label: 'Restaurant & Food' },
                    { value: 'salon', label: 'Salon & Spa' },
                    { value: 'gym', label: 'Gym & Fitness' },
                    { value: 'clinic', label: 'Clinic & Healthcare' },
                    { value: 'boutique', label: 'Boutique & Fashion' },
                    { value: 'kirana', label: 'Retail & Kirana' },
                    { value: 'tea-shop', label: 'Tea & Juice Shop' },
                  ]}
                  value={createFlow.businessType}
                  onChange={(v) =>
                    updateCreateFlow({ businessType: v as any })
                  }
                  radius="lg"
                  size="sm"
                  searchable
                />

                <Select
                  placeholder="Content goal"
                  leftSection={<IconTarget size={14} />}
                  data={GOALS}
                  value={createFlow.contentGoal}
                  onChange={(v) =>
                    updateCreateFlow({ contentGoal: v as any })
                  }
                  radius="lg"
                  size="sm"
                />

                <Textarea
                  placeholder="Any specific details? (optional)"
                  value={createFlow.context || ''}
                  onChange={(e) =>
                    updateCreateFlow({ context: e.currentTarget.value })
                  }
                  radius="lg"
                  minRows={2}
                  maxRows={4}
                  autosize
                  size="sm"
                />
              </Stack>
            </Paper>

            {/* Step 2: Where to post */}
            <Paper p="md" radius="lg" withBorder className="bg-card">
              <Group gap="xs" mb="sm">
                <Badge size="lg" variant="filled" color="violet" circle>
                  2
                </Badge>
                <Text fw={600} size="sm">
                  Where to post?
                </Text>
              </Group>

              <Group gap="xs">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = createFlow.platforms.includes(
                    platform.value,
                  )
                  return (
                    <motion.div
                      key={platform.value}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Paper
                        p="xs"
                        px="sm"
                        radius="lg"
                        withBorder
                        onClick={() => togglePlatform(platform.value)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected
                            ? `2px solid var(--mantine-color-${platform.color}-5)`
                            : undefined,
                          background: isSelected
                            ? `var(--mantine-color-${platform.color}-0)`
                            : undefined,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Group gap={6} wrap="nowrap">
                          <Icon
                            size={16}
                            style={{
                              color: isSelected
                                ? `var(--mantine-color-${platform.color}-6)`
                                : undefined,
                            }}
                          />
                          <Text
                            size="xs"
                            fw={isSelected ? 600 : 400}
                          >
                            {platform.label}
                          </Text>
                        </Group>
                      </Paper>
                    </motion.div>
                  )
                })}
              </Group>
            </Paper>

            {/* Step 3: When to post */}
            <Paper p="md" radius="lg" withBorder className="bg-card">
              <Group gap="xs" mb="sm">
                <Badge size="lg" variant="filled" color="violet" circle>
                  3
                </Badge>
                <Text fw={600} size="sm">
                  When? (optional)
                </Text>
              </Group>

              <SimpleGrid cols={2} spacing="sm">
                <DatePickerInput
                  placeholder="Pick date"
                  leftSection={<IconCalendar size={14} />}
                  value={createFlow.scheduledDate}
                  onChange={(v) =>
                    updateCreateFlow({ scheduledDate: v ? new Date(v) : null })
                  }
                  radius="lg"
                  size="sm"
                  minDate={new Date()}
                />
                <TimeInput
                  placeholder="Pick time"
                  value={createFlow.scheduledTime || ''}
                  onChange={(e) =>
                    updateCreateFlow({
                      scheduledTime: e.currentTarget.value,
                    })
                  }
                  radius="lg"
                  size="sm"
                />
              </SimpleGrid>
            </Paper>

            {/* AI Defaults note */}
            {createFlow.businessType && createFlow.tone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Paper
                  p="xs"
                  radius="lg"
                  className="bg-primary/5"
                >
                  <Group gap="xs" wrap="nowrap">
                    <IconWand size={14} className="text-primary shrink-0" />
                    <Text size="xs" c="dimmed">
                      AI defaults applied: {createFlow.tone} tone,{' '}
                      {createFlow.language},{' '}
                      {createFlow.visualStyle} style
                    </Text>
                  </Group>
                </Paper>
              </motion.div>
            )}

            {/* Actions */}
            <Group gap="sm" grow>
              <Button
                variant="light"
                color="violet"
                radius="lg"
                disabled={!createFlow.generatedCaption}
                loading={createContentMutation.isPending}
                onClick={handleSaveAsDraft}
              >
                Save Draft
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: 'violet', to: 'indigo' }}
                radius="lg"
                leftSection={<IconRocket size={16} />}
                disabled={
                  !createFlow.generatedCaption ||
                  !createFlow.scheduledDate
                }
                loading={createContentMutation.isPending}
                onClick={handleSchedule}
              >
                Schedule
              </Button>
            </Group>

            {/* Sharing actions */}
            {createFlow.generatedCaption && (
              <ContentActions
                caption={createFlow.generatedCaption}
                hashtags={createFlow.generatedHashtags}
              />
            )}
          </Stack>
        </motion.div>

        {/* Right: Preview */}
        {!isMobile && (
          <Box className="flex-1 min-w-0">
            <ContentPreview className="h-full overflow-y-auto" />
          </Box>
        )}
      </Box>
    </div>
  )
}
