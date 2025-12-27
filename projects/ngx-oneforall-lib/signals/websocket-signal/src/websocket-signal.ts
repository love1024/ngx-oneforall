import { isPlatformBrowser } from '@angular/common';
import {
  signal,
  type Signal,
  inject,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';

export interface WebSocketState<T> {
  messages: Signal<T | null>;
  error: Signal<Event | null>;
  status: Signal<'connecting' | 'open' | 'closed' | 'error'>;
  send: (msg: T) => void;
  close: () => void;
}

export function webSocketSignal<T>(url: string): WebSocketState<T> {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);

  const messages = signal<T | null>(null);
  const error = signal<Event | null>(null);
  const status = signal<'connecting' | 'open' | 'closed' | 'error'>(
    isPlatformBrowser(platformId) ? 'connecting' : 'closed'
  );

  let ws: WebSocket | null = null;

  if (isPlatformBrowser(platformId)) {
    ws = new WebSocket(url);

    ws.onopen = () => status.set('open');

    ws.onmessage = ev => {
      try {
        messages.set(JSON.parse(ev.data));
      } catch {
        messages.set(ev.data as T);
      }
    };

    ws.onerror = ev => {
      error.set(ev);
      status.set('error');
    };

    ws.onclose = () => status.set('closed');

    destroyRef.onDestroy(() => ws?.close());
  }

  const send = (msg: T) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      error.set(new Event('WebSocket not open'));
    }
  };

  const close = () => ws?.close();

  return { messages, error, status, send, close };
}
