`webSocketSignal` creates a reactive interface for a WebSocket connection. It manages the connection lifecycle and provides signals for messages, errors, and connection status.

## Usage

Use `webSocketSignal` to easily integrate real-time features. It handles the underlying `WebSocket` complexity and exposes it via Angular Signals.

{{ NgDocActions.demo("WebSocketSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { effect, Component } from '@angular/core';
import { webSocketSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class ChatComponent {
    socket = webSocketSignal<string>('wss://echo.websocket.org');

    constructor() {
        effect(() => {
            const msg = this.socket.messages();
            if (msg) console.log('New message:', msg);
        });
    }

    sendMessage(text: string) {
        if (this.socket.status() === 'open') {
            this.socket.send(text);
        }
    }
}
```

## API

`webSocketSignal<T>(url: string): WebSocketState<T>`

Returns a `WebSocketState` object containing:

- **messages**: `Signal<T | null>` - The latest received message.
- **error**: `Signal<Event | null>` - The latest error event.
- **status**: `Signal<'connecting' | 'open' | 'closed' | 'error'>` - Current connection status.
- **send**: `(msg: T) => void` - Function to send messages.
- **close**: `() => void` - Function to close the connection.

> **Note**
> The connection is automatically closed when the component or injection context is destroyed.
