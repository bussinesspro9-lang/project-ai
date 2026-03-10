'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@/lib/auth';

type RealtimeEventType =
  | 'content.updated'
  | 'content.published'
  | 'engagement.new'
  | 'plan.generated'
  | 'achievement.unlocked'
  | 'streak.updated'
  | 'insight.new'
  | 'stats.updated'
  | 'heartbeat';

interface RealtimeEvent {
  type: RealtimeEventType;
  payload?: Record<string, unknown>;
}

type EventHandler = (event: RealtimeEvent) => void;

const MAX_RECONNECT_ATTEMPTS = 3;
const MIN_STABLE_MS = 5_000;

const QUERY_INVALIDATION_MAP: Record<string, string[][]> = {
  'content.updated': [['content'], ['dashboard']],
  'content.published': [['content'], ['dashboard'], ['analytics']],
  'engagement.new': [['engagement'], ['dashboard']],
  'plan.generated': [['content-plans'], ['dashboard']],
  'achievement.unlocked': [['achievements'], ['gamification']],
  'streak.updated': [['gamification'], ['dashboard']],
  'insight.new': [['insights'], ['dashboard']],
  'stats.updated': [['dashboard'], ['analytics']],
};

export function useRealtimeEvents(handlers?: Partial<Record<RealtimeEventType, EventHandler>>) {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const lastConnectedAt = useRef(0);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token) return;

    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(
      '/api/v1',
      '',
    );
    const url = `${apiBase}/api/v1/realtime/events?token=${encodeURIComponent(token)}`;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      lastConnectedAt.current = Date.now();
    };

    es.onmessage = (msg) => {
      try {
        const event: RealtimeEvent = JSON.parse(msg.data);

        if (event.type === 'heartbeat') return;

        reconnectAttempts.current = 0;

        const keys = QUERY_INVALIDATION_MAP[event.type];
        if (keys) {
          keys.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }

        const currentHandlers = handlersRef.current;
        if (currentHandlers && currentHandlers[event.type]) {
          currentHandlers[event.type]!(event);
        }
      } catch {
        // ignore malformed events
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;

      const wasStable = Date.now() - lastConnectedAt.current > MIN_STABLE_MS;
      if (wasStable) {
        reconnectAttempts.current = 0;
      } else {
        reconnectAttempts.current += 1;
      }

      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;

      const delay = Math.min(2000 * 2 ** reconnectAttempts.current, 30_000);
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [connect]);
}
