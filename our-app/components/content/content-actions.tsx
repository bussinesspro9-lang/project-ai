'use client'

import { useState } from 'react'
import {
  Group,
  ActionIcon,
  Tooltip,
  CopyButton,
  Menu,
  Text,
  Badge,
} from '@mantine/core'
import {
  IconCopy,
  IconCheck,
  IconBrandWhatsapp,
  IconShare,
  IconDownload,
  IconDots,
  IconBrandInstagram,
  IconBrandFacebook,
  IconLink,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useWhatsAppShare } from '@/hooks/use-whatsapp-share'

interface ContentActionsProps {
  caption: string
  hashtags?: string[]
  imageUrl?: string
  isFreeTier?: boolean
  compact?: boolean
}

export function ContentActions({
  caption,
  hashtags = [],
  imageUrl,
  isFreeTier = false,
  compact = false,
}: ContentActionsProps) {
  const { share: shareWhatsApp } = useWhatsAppShare()
  const fullText = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}${isFreeTier ? '\n\nPowered by BusinessPro' : ''}`

  const handleWhatsAppShare = () => {
    shareWhatsApp({ text: fullText })
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: fullText,
        })
      } catch {
        // cancelled
      }
    }
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fullText)
    notifications.show({
      title: 'Copied!',
      message: 'Caption copied to clipboard',
      color: 'green',
    })
  }

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags.map((h) => `#${h}`).join(' '))
    notifications.show({
      title: 'Copied!',
      message: 'Hashtags copied to clipboard',
      color: 'green',
    })
  }

  if (compact) {
    return (
      <Group gap={4}>
        <CopyButton value={fullText}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied!' : 'Copy all'}>
              <ActionIcon
                variant="subtle"
                color={copied ? 'green' : 'gray'}
                size="sm"
                onClick={copy}
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
        <Tooltip label="Share via WhatsApp">
          <ActionIcon
            variant="subtle"
            color="green"
            size="sm"
            onClick={handleWhatsAppShare}
          >
            <IconBrandWhatsapp size={14} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Share">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={handleNativeShare}
          >
            <IconShare size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    )
  }

  return (
    <Group gap="xs">
      <CopyButton value={fullText}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied!' : 'Copy caption + hashtags'}>
            <ActionIcon
              variant="light"
              color={copied ? 'green' : 'violet'}
              size="md"
              radius="lg"
              onClick={copy}
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>

      <Tooltip label="Share on WhatsApp">
        <ActionIcon
          variant="light"
          color="green"
          size="md"
          radius="lg"
          onClick={handleWhatsAppShare}
        >
          <IconBrandWhatsapp size={16} />
        </ActionIcon>
      </Tooltip>

      <Menu shadow="md" width={200} radius="lg">
        <Menu.Target>
          <Tooltip label="More actions">
            <ActionIcon variant="light" color="gray" size="md" radius="lg">
              <IconDots size={16} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconCopy size={14} />}
            onClick={handleCopyCaption}
          >
            Copy Caption
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLink size={14} />}
            onClick={handleCopyHashtags}
          >
            Copy Hashtags
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconShare size={14} />}
            onClick={handleNativeShare}
          >
            Share via...
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {isFreeTier && (
        <Badge size="xs" variant="light" color="gray">
          Powered by BusinessPro
        </Badge>
      )}
    </Group>
  )
}
