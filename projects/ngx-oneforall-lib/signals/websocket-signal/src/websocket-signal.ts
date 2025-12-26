import { signal, type Signal, inject, DestroyRef } from '@angular/core';

export interface WebSocketState<T> {
    messages: Signal<T | null>;
    error: Signal<Event | null>;
    status: Signal<'connecting' | 'open' | 'closed' | 'error'>;
    send: (msg: T) => void;
    close: () => void;
}

export function webSocketSignal<T>(url: string): WebSocketState<T> {
    const destroyRef = inject(DestroyRef);

    const messages = signal<T | null>(null);
    const error = signal<Event | null>(null);
    const status = signal<'connecting' | 'open' | 'closed' | 'error'>('connecting');

    const ws = new WebSocket(url);

    ws.onopen = () => status.set('open');

    ws.onmessage = (ev) => {
        try {
            messages.set(JSON.parse(ev.data));
        } catch {
            messages.set(ev.data as any);
        }
    };

    ws.onerror = (ev) => {
        error.set(ev);
        status.set('error');
    };

    ws.onclose = () => status.set('closed');

    const send = (msg: T) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
        } else {
            error.set(new Event('WebSocket not open'));
        }
    };

    const close = () => ws.close();

    destroyRef.onDestroy(() => ws.close());

    return { messages, error, status, send, close };
}
