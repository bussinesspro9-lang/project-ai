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
  TextInput,
  ActionIcon,
  Tooltip,
  Loader,
  Center,
} from '@mantine/core'
import {
  IconTemplate,
  IconSearch,
  IconSparkles,
  IconStarFilled,
  IconEye,
  IconTrendingUp,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
  useTemplateLibraryControllerFindAll,
  useTemplateLibraryControllerUseTemplate,
} from '@businesspro/api-client'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'festival', label: 'Festival' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'industry', label: 'Industry' },
  { value: 'milestone', label: 'Milestone' },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [featured, setFeatured] = useState(false)

  const { data, isLoading, error } = useTemplateLibraryControllerFindAll(
    {
      ...(category !== 'all' && { category: category as any }),
      ...(search && { search }),
      limit: 50,
    },
  ) as any

  const useTemplateMutation = useTemplateLibraryControllerUseTemplate()

  const templates: any[] = data?.data ?? data ?? []
  const filtered = featured ? templates.filter((t: any) => t.isFeatured) : templates

  const handleUseTemplate = (template: any) => {
    useTemplateMutation.mutate(
      { id: template.id },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Template Applied',
            message: `"${template.title}" loaded into content creator`,
            color: 'violet',
          })
          router.push('/create')
        },
        onError: () => {
          notifications.show({
            title: 'Error',
            message: 'Failed to apply template',
            color: 'red',
          })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader color="violet" size="lg" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Text c="red" fw={500}>Failed to load templates</Text>
          <Button variant="light" color="violet" onClick={() => window.location.reload()}>
            Retry
          </Button>
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
            Template Library
          </Text>
          <Text size="sm" c="dimmed">
            Browse hundreds of ready-to-use content templates for your business
          </Text>
        </Stack>
      </motion.div>

      <Group mb="lg" gap="sm" wrap="wrap">
        <TextInput
          placeholder="Search templates..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="lg"
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          data={CATEGORIES}
          value={category}
          onChange={(v) => setCategory(v || 'all')}
          radius="lg"
          w={160}
        />
        <Button
          variant={featured ? 'filled' : 'light'}
          color="yellow"
          leftSection={<IconStarFilled size={14} />}
          radius="lg"
          onClick={() => setFeatured(!featured)}
        >
          Featured
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {filtered.map((template: any, idx: number) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Paper
              p="lg"
              radius="lg"
              withBorder
              className="bg-card h-full flex flex-col"
            >
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <Badge size="sm" variant="light" color="violet">
                    {template.category}
                  </Badge>
                  {template.isFeatured && (
                    <Badge size="sm" variant="light" color="yellow" leftSection={<IconStarFilled size={10} />}>
                      Featured
                    </Badge>
                  )}
                </Group>
                {template.effectivenessScore > 0 && (
                  <Badge size="xs" variant="dot" color="green">
                    {template.effectivenessScore}% effective
                  </Badge>
                )}
              </Group>

              <Text fw={600} size="md" mb="xs">
                {template.title}
              </Text>

              <Paper
                p="sm"
                radius="md"
                className="bg-secondary/30"
                mb="sm"
                style={{ flex: 1 }}
              >
                <Text size="sm" c="dimmed" lineClamp={3}>
                  {template.contentSkeleton}
                </Text>
              </Paper>

              <Group gap="xs" mb="sm" wrap="wrap">
                {(template.tags ?? template.keywords ?? []).slice(0, 4).map((tag: string) => (
                  <Badge key={tag} size="xs" variant="outline" color="gray">
                    #{tag}
                  </Badge>
                ))}
              </Group>

              <Group justify="space-between" mt="auto">
                <Group gap="xs">
                  <Text size="xs" c="dimmed">
                    <IconTrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                    {(template.usageCount ?? 0).toLocaleString()} uses
                  </Text>
                  <Text size="xs" c="dimmed">
                    &middot; {(template.languages ?? []).join(', ')}
                  </Text>
                </Group>
                <Group gap={4}>
                  <Tooltip label="Preview">
                    <ActionIcon variant="light" color="gray" size="sm" radius="lg">
                      <IconEye size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Button
                    size="xs"
                    variant="light"
                    color="violet"
                    radius="lg"
                    leftSection={<IconSparkles size={12} />}
                    onClick={() => handleUseTemplate(template)}
                    loading={useTemplateMutation.isPending}
                  >
                    Use
                  </Button>
                </Group>
              </Group>
            </Paper>
          </motion.div>
        ))}
      </SimpleGrid>

      {filtered.length === 0 && (
        <Paper p="xl" radius="lg" withBorder className="bg-card">
          <Stack align="center" gap="md">
            <IconTemplate size={48} style={{ opacity: 0.3 }} />
            <Text size="lg" fw={500} c="dimmed">
              No templates found
            </Text>
            <Text size="sm" c="dimmed">
              Try adjusting your search or filters
            </Text>
          </Stack>
        </Paper>
      )}
    </div>
  )
}
