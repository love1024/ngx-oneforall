import { isPlatformBrowser } from '@angular/common';
import {
  signal,
  type Signal,
  inject,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';

/**
 * WebSocket connection state and controls.
 */
export interface WebSocketState<T> {
  /** Latest received message */
  messages: Signal<T | null>;
  /** Latest error event */
  error: Signal<Event | null>;
  /** Current connection status */
  status: Signal<'connecting' | 'open' | 'closed' | 'error'>;
  /** Send a message to the server */
  send: (msg: T) => void;
  /** Close the connection */
  close: () => void;
}

/**
 * Creates a reactive WebSocket connection with signal-based state.
 * Automatically parses JSON messages and cleans up on destroy.
 *
 * @param url - WebSocket server URL
 * @returns WebSocket state object with signals and controls
 *
 * @example
 * ```typescript
 * const socket = webSocketSignal<ChatMessage>('wss://api.example.com/ws');
 * effect(() => console.log(socket.messages()));
 * socket.send({ text: 'Hello' });
 * ```
 */
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

  return {
    messages: messages.asReadonly(),
    error: error.asReadonly(),
    status: status.asReadonly(),
    send,
    close,
  };
}
