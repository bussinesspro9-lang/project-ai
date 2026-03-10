'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Paper,
  Text,
  Stack,
  Group,
  Box,
  ActionIcon,
  Badge,
  Tooltip,
} from '@mantine/core'
import {
  IconBulb,
  IconChevronRight,
  IconChevronLeft,
  IconSparkles,
  IconTrendingUp,
  IconFlame,
  IconTarget,
  IconClock,
} from '@tabler/icons-react'

const INSIGHTS = [
  {
    id: 1,
    text: 'Your Instagram posts at 10 AM get 3x more engagement! Try posting your next content at this golden hour.',
    category: 'timing',
    tone: 'encouraging',
    icon: IconClock,
    color: 'blue',
  },
  {
    id: 2,
    text: 'You\'re on a 5-day posting streak! That\'s better than 89% of businesses in your category. Keep it up!',
    category: 'streak',
    tone: 'playful',
    icon: IconFlame,
    color: 'orange',
  },
  {
    id: 3,
    text: 'Festival content is trending right now. Businesses posting Holi-themed content are seeing 4x engagement.',
    category: 'trend',
    tone: 'analytical',
    icon: IconTrendingUp,
    color: 'green',
  },
  {
    id: 4,
    text: 'Your audience loves food photos! Posts with food images get 65% more likes than text-only posts.',
    category: 'content_type',
    tone: 'encouraging',
    icon: IconTarget,
    color: 'violet',
  },
]

export function InsightWidget() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const insight = INSIGHTS[currentIndex]
  const Icon = insight.icon

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % INSIGHTS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Paper p="lg" radius="lg" withBorder className="bg-card">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconBulb size={18} className="text-primary" />
          <Text fw={600} size="sm">
            AI Insight
          </Text>
          <Badge size="xs" variant="light" color="violet">
            Personalized
          </Badge>
        </Group>
        <Group gap={4}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() =>
              setCurrentIndex(
                (currentIndex - 1 + INSIGHTS.length) % INSIGHTS.length,
              )
            }
          >
            <IconChevronLeft size={14} />
          </ActionIcon>
          <Text size="xs" c="dimmed">
            {currentIndex + 1}/{INSIGHTS.length}
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() =>
              setCurrentIndex((currentIndex + 1) % INSIGHTS.length)
            }
          >
            <IconChevronRight size={14} />
          </ActionIcon>
        </Group>
      </Group>

      <AnimatePresence mode="wait">
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Group gap="sm" wrap="nowrap" align="flex-start">
            <Box
              className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
              style={{
                backgroundColor: `var(--mantine-color-${insight.color}-1)`,
              }}
            >
              <Icon
                size={20}
                style={{ color: `var(--mantine-color-${insight.color}-6)` }}
              />
            </Box>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              {insight.text}
            </Text>
          </Group>
        </motion.div>
      </AnimatePresence>
    </Paper>
  )
}
