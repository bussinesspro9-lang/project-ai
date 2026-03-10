'use client'

import { motion } from 'framer-motion'
import {
  Paper,
  Text,
  Stack,
  Group,
  Box,
  Badge,
  Button,
} from '@mantine/core'
import {
  IconConfetti,
  IconCalendarEvent,
  IconSparkles,
  IconArrowRight,
} from '@tabler/icons-react'
import Link from 'next/link'

const UPCOMING_FESTIVALS = [
  {
    name: 'Holi',
    date: 'Mar 14, 2026',
    daysAway: 10,
    type: 'national',
    themes: ['colors', 'joy', 'celebration'],
    color: 'pink',
  },
  {
    name: 'Ugadi / Gudi Padwa',
    date: 'Mar 22, 2026',
    daysAway: 18,
    type: 'regional',
    themes: ['new year', 'prosperity', 'tradition'],
    color: 'orange',
  },
  {
    name: 'Ram Navami',
    date: 'Apr 6, 2026',
    daysAway: 33,
    type: 'religious',
    themes: ['devotion', 'celebration', 'tradition'],
    color: 'yellow',
  },
]

export function FestivalWidget() {
  return (
    <Paper p="lg" radius="lg" withBorder className="bg-card">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconConfetti size={18} className="text-primary" />
          <Text fw={600} size="sm">
            Upcoming Festivals
          </Text>
        </Group>
        <Button
          variant="subtle"
          color="violet"
          size="xs"
          rightSection={<IconArrowRight size={12} />}
          component={Link}
          href="/templates?category=festival"
        >
          View All
        </Button>
      </Group>

      <Stack gap="sm">
        {UPCOMING_FESTIVALS.map((festival, idx) => (
          <motion.div
            key={festival.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Paper
              p="sm"
              radius="md"
              withBorder
              style={{
                borderLeft: `3px solid var(--mantine-color-${festival.color}-5)`,
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <Box
                    className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                    style={{
                      backgroundColor: `var(--mantine-color-${festival.color}-1)`,
                    }}
                  >
                    <IconCalendarEvent
                      size={18}
                      style={{
                        color: `var(--mantine-color-${festival.color}-6)`,
                      }}
                    />
                  </Box>
                  <Stack gap={2}>
                    <Group gap="xs">
                      <Text size="sm" fw={600}>
                        {festival.name}
                      </Text>
                      <Badge size="xs" variant="light" color={festival.color}>
                        {festival.type}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {festival.date}
                    </Text>
                  </Stack>
                </Group>

                <Stack gap={4} align="flex-end">
                  <Badge
                    size="sm"
                    variant="light"
                    color={festival.daysAway <= 7 ? 'red' : 'gray'}
                  >
                    {festival.daysAway}d away
                  </Badge>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="violet"
                    leftSection={<IconSparkles size={10} />}
                    component={Link}
                    href={`/create?festival=${festival.name.toLowerCase()}`}
                    style={{ padding: '0 8px', height: 22 }}
                  >
                    Create
                  </Button>
                </Stack>
              </Group>
            </Paper>
          </motion.div>
        ))}
      </Stack>
    </Paper>
  )
}
