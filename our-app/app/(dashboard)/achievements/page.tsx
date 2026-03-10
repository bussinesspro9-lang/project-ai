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
  Progress,
  RingProgress,
  Tooltip,
  Loader,
  Center,
} from '@mantine/core'
import {
  IconTrophy,
  IconFlame,
  IconStar,
  IconSparkles,
  IconMedal,
  IconChartLine,
  IconTarget,
  IconLock,
  IconCheck,
} from '@tabler/icons-react'
import {
  useGamificationControllerGetDefinitions,
  useGamificationControllerGetUserAchievements,
} from '@businesspro/api-client'

const TIER_COLORS: Record<string, string> = {
  bronze: 'orange',
  silver: 'gray',
  gold: 'yellow',
  platinum: 'violet',
}

const CATEGORIES = [
  { value: 'all', label: 'All', icon: IconTrophy },
  { value: 'posting', label: 'Posting', icon: IconSparkles },
  { value: 'engagement', label: 'Engagement', icon: IconTarget },
  { value: 'consistency', label: 'Consistency', icon: IconFlame },
  { value: 'growth', label: 'Growth', icon: IconChartLine },
  { value: 'learning', label: 'Learning', icon: IconStar },
]

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const { data: definitionsData, isLoading: loadingDefs } = useGamificationControllerGetDefinitions() as any
  const { data: userAchievementsData, isLoading: loadingUser } = useGamificationControllerGetUserAchievements() as any

  const definitions: any[] = definitionsData ?? []
  const userAchievements: any[] = userAchievementsData ?? []

  const achievementMap = new Map<number, any>()
  for (const ua of userAchievements) {
    achievementMap.set(ua.achievementId ?? ua.achievement?.id, ua)
  }

  const achievements = definitions.map((def: any) => {
    const ua = achievementMap.get(def.id)
    const unlocked = ua ? ua.progress >= def.conditionValue : false
    return {
      ...def,
      unlocked,
      unlockedAt: ua?.unlockedAt,
      progress: ua ? Math.min(100, Math.round((ua.progress / def.conditionValue) * 100)) : 0,
    }
  })

  const filtered =
    activeCategory === 'all'
      ? achievements
      : achievements.filter((a: any) => a.category === activeCategory)

  const unlockedCount = achievements.filter((a: any) => a.unlocked).length
  const totalXP = achievements
    .filter((a: any) => a.unlocked)
    .reduce((s: number, a: any) => s + (a.xpReward ?? 0), 0)

  const isLoading = loadingDefs || loadingUser

  if (isLoading) {
    return <Center h={400}><Loader color="violet" size="lg" /></Center>
  }

  if (achievements.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <IconTrophy size={48} style={{ opacity: 0.3 }} />
          <Text size="lg" fw={500} c="dimmed">No achievements yet</Text>
          <Text size="sm" c="dimmed">Start creating content to unlock badges</Text>
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
        <Stack gap={4} mb="xl">
          <Text size="xl" fw={700} className="text-foreground">
            Achievements
          </Text>
          <Text size="sm" c="dimmed">
            Complete challenges, earn XP, and unlock badges
          </Text>
        </Stack>
      </motion.div>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Paper p="md" radius="lg" withBorder className="bg-card text-center">
            <Text size="2rem" fw={700} className="text-primary">{totalXP}</Text>
            <Text size="xs" c="dimmed" fw={500}>Total XP</Text>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <Paper p="md" radius="lg" withBorder className="bg-card text-center">
            <Text size="2rem" fw={700} className="text-foreground">
              {unlockedCount}/{achievements.length}
            </Text>
            <Text size="xs" c="dimmed" fw={500}>Unlocked</Text>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Paper p="md" radius="lg" withBorder className="bg-card text-center">
            <RingProgress
              size={64}
              thickness={6}
              sections={[{
                value: achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0,
                color: 'violet',
              }]}
              label={
                <Text size="xs" fw={700} ta="center">
                  {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
                </Text>
              }
              style={{ margin: '0 auto' }}
            />
            <Text size="xs" c="dimmed" fw={500} mt={4}>Completion</Text>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}>
          <Paper p="md" radius="lg" withBorder className="bg-card text-center">
            <Text size="2rem" fw={700} className="text-foreground">
              {achievements.filter((a: any) => a.badgeTier === 'gold' || a.badgeTier === 'platinum').filter((a: any) => a.unlocked).length}
            </Text>
            <Text size="xs" c="dimmed" fw={500}>Elite Badges</Text>
          </Paper>
        </motion.div>
      </SimpleGrid>

      <Group mb="lg" gap="xs" wrap="wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? 'filled' : 'light'}
              color="violet"
              size="xs"
              radius="lg"
              leftSection={<Icon size={14} />}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </Button>
          )
        })}
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {filtered.map((achievement: any, idx: number) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
          >
            <Paper
              p="md"
              radius="lg"
              withBorder
              className="bg-card h-full"
              style={{ opacity: achievement.unlocked ? 1 : 0.75 }}
            >
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <Box
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: achievement.unlocked
                        ? `var(--mantine-color-${TIER_COLORS[achievement.badgeTier] || 'gray'}-1)`
                        : 'var(--mantine-color-gray-1)',
                    }}
                  >
                    {achievement.unlocked ? (
                      <IconMedal
                        size={22}
                        style={{ color: `var(--mantine-color-${TIER_COLORS[achievement.badgeTier] || 'gray'}-6)` }}
                      />
                    ) : (
                      <IconLock size={18} style={{ opacity: 0.4 }} />
                    )}
                  </Box>
                  <Stack gap={2}>
                    <Text fw={600} size="sm">{achievement.title}</Text>
                    <Badge size="xs" variant="light" color={TIER_COLORS[achievement.badgeTier] || 'gray'}>
                      {achievement.badgeTier} &middot; {achievement.xpReward} XP
                    </Badge>
                  </Stack>
                </Group>

                {achievement.unlocked && (
                  <Tooltip label={`Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}`}>
                    <Badge size="xs" variant="filled" color="green" circle>
                      <IconCheck size={10} />
                    </Badge>
                  </Tooltip>
                )}
              </Group>

              <Text size="xs" c="dimmed" mb="sm">{achievement.description}</Text>

              <Progress
                value={achievement.progress}
                size="sm"
                radius="xl"
                color={achievement.unlocked ? 'green' : TIER_COLORS[achievement.badgeTier] || 'gray'}
              />
              <Text size="10px" c="dimmed" ta="right" mt={4}>{achievement.progress}%</Text>
            </Paper>
          </motion.div>
        ))}
      </SimpleGrid>
    </div>
  )
}
