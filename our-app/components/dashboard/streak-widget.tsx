'use client'

import { motion } from 'framer-motion'
import {
  Paper,
  Text,
  Group,
  Box,
  Badge,
  Stack,
} from '@mantine/core'
import {
  IconFlame,
  IconTrophy,
  IconMedal,
} from '@tabler/icons-react'
import Link from 'next/link'

interface StreakWidgetProps {
  streak?: number
  xp?: number
  nextAchievement?: string
  nextAchievementProgress?: number
}

export function StreakWidget({
  streak = 5,
  xp = 185,
  nextAchievement = 'Week Warrior',
  nextAchievementProgress = 71,
}: StreakWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Paper
        p="md"
        radius="lg"
        withBorder
        className="bg-card cursor-pointer"
        component={Link}
        href="/achievements"
        style={{ textDecoration: 'none' }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Box
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.65 0.2 30), oklch(0.7 0.18 40))',
                }}
              >
                <IconFlame size={24} color="white" />
              </Box>
            </motion.div>
            <Stack gap={2}>
              <Group gap="xs">
                <Text size="lg" fw={700}>
                  {streak} Day Streak
                </Text>
                <Badge size="xs" variant="light" color="orange">
                  <IconFlame size={8} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  On Fire!
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                {xp} XP total &middot; Next: {nextAchievement} ({nextAchievementProgress}%)
              </Text>
            </Stack>
          </Group>

          <Box className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
            <IconTrophy size={16} color="var(--mantine-color-yellow-7)" />
          </Box>
        </Group>
      </Paper>
    </motion.div>
  )
}
