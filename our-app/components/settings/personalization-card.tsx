'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Paper,
  Text,
  Stack,
  Group,
  Badge,
  Switch,
  Box,
  Progress,
  Select,
  SimpleGrid,
  Button,
  Tooltip,
} from '@mantine/core'
import {
  IconBrain,
  IconSparkles,
  IconLanguage,
  IconPalette,
  IconMoodSmile,
  IconRefresh,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

interface PersonalizationCardProps {
  index?: number
}

export function PersonalizationCard({ index = 0 }: PersonalizationCardProps) {
  const [personalizedMode, setPersonalizedMode] = useState(true)
  const [preferredTone, setPreferredTone] = useState<string | null>('friendly')
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>('english')
  const [preferredCaptionLength, setPreferredCaptionLength] = useState<string | null>('medium')

  const learnedPreferences = {
    bestPostingTime: '10:30 AM',
    topHashtags: ['#cafe', '#coffee', '#foodie'],
    preferredPlatform: 'Instagram',
    engagementPeak: 'Weekdays',
    signalsRecorded: 142,
    confidenceLevel: 78,
  }

  const handleResetPreferences = () => {
    notifications.show({
      title: 'Preferences Reset',
      message: 'Your AI preferences have been reset to defaults',
      color: 'blue',
    })
  }

  const handleSavePreferences = () => {
    notifications.show({
      title: 'Preferences Saved',
      message: 'Your AI profile has been updated',
      color: 'green',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Paper p="lg" radius="lg" withBorder className="bg-card">
        <Group justify="space-between" mb="lg">
          <Group gap="sm">
            <Box className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IconBrain size={20} className="text-primary" />
            </Box>
            <Stack gap={2}>
              <Text fw={600} size="md">
                My AI Profile
              </Text>
              <Text size="xs" c="dimmed">
                How AI personalizes content for you
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <Tooltip label="AI learns from your usage patterns to make better suggestions">
              <IconInfoCircle size={16} style={{ opacity: 0.5 }} />
            </Tooltip>
            <Switch
              checked={personalizedMode}
              onChange={(e) => setPersonalizedMode(e.currentTarget.checked)}
              label="Personalized Mode"
              size="sm"
              color="violet"
            />
          </Group>
        </Group>

        {personalizedMode && (
          <Stack gap="md">
            <Paper p="md" radius="md" className="bg-primary/5">
              <Group gap="xs" mb="sm">
                <IconSparkles size={14} className="text-primary" />
                <Text size="sm" fw={600}>
                  AI has learned from {learnedPreferences.signalsRecorded} interactions
                </Text>
              </Group>
              <Progress
                value={learnedPreferences.confidenceLevel}
                size="sm"
                radius="xl"
                color="violet"
                mb="xs"
              />
              <Text size="xs" c="dimmed">
                Confidence: {learnedPreferences.confidenceLevel}% - AI recommendations
                are getting better
              </Text>
            </Paper>

            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
              <Paper p="sm" radius="md" withBorder className="text-center">
                <Text size="xs" c="dimmed" mb={4}>
                  Best Posting Time
                </Text>
                <Text size="sm" fw={600}>
                  {learnedPreferences.bestPostingTime}
                </Text>
              </Paper>
              <Paper p="sm" radius="md" withBorder className="text-center">
                <Text size="xs" c="dimmed" mb={4}>
                  Top Platform
                </Text>
                <Text size="sm" fw={600}>
                  {learnedPreferences.preferredPlatform}
                </Text>
              </Paper>
              <Paper p="sm" radius="md" withBorder className="text-center">
                <Text size="xs" c="dimmed" mb={4}>
                  Peak Engagement
                </Text>
                <Text size="sm" fw={600}>
                  {learnedPreferences.engagementPeak}
                </Text>
              </Paper>
              <Paper p="sm" radius="md" withBorder className="text-center">
                <Text size="xs" c="dimmed" mb={4}>
                  Top Hashtags
                </Text>
                <Group gap={4} justify="center" wrap="wrap">
                  {learnedPreferences.topHashtags.map((h) => (
                    <Badge key={h} size="xs" variant="light" color="violet">
                      {h}
                    </Badge>
                  ))}
                </Group>
              </Paper>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
              <Select
                label="Preferred Tone"
                leftSection={<IconMoodSmile size={14} />}
                data={[
                  { value: 'friendly', label: 'Friendly' },
                  { value: 'professional', label: 'Professional' },
                  { value: 'fun', label: 'Fun & Playful' },
                  { value: 'minimal', label: 'Minimal' },
                ]}
                value={preferredTone}
                onChange={setPreferredTone}
                radius="lg"
                size="sm"
              />
              <Select
                label="Preferred Language"
                leftSection={<IconLanguage size={14} />}
                data={[
                  { value: 'english', label: 'English' },
                  { value: 'hindi', label: 'Hindi' },
                  { value: 'hinglish', label: 'Hinglish' },
                ]}
                value={preferredLanguage}
                onChange={setPreferredLanguage}
                radius="lg"
                size="sm"
              />
              <Select
                label="Caption Length"
                leftSection={<IconPalette size={14} />}
                data={[
                  { value: 'short', label: 'Short & Punchy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'long', label: 'Detailed' },
                ]}
                value={preferredCaptionLength}
                onChange={setPreferredCaptionLength}
                radius="lg"
                size="sm"
              />
            </SimpleGrid>

            <Group justify="space-between">
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                leftSection={<IconRefresh size={14} />}
                onClick={handleResetPreferences}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="light"
                color="violet"
                size="sm"
                leftSection={<IconCheck size={14} />}
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            </Group>
          </Stack>
        )}
      </Paper>
    </motion.div>
  )
}
