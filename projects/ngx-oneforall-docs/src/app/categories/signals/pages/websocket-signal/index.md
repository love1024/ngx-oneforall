![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/websocket-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`webSocketSignal` creates a reactive interface for WebSocket connections. It manages the connection lifecycle and provides signals for messages, status, and errors.

## Usage

Use `webSocketSignal` to integrate real-time WebSocket features with Angular's signal-based reactivity.

{{ NgDocActions.demo("WebSocketSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { webSocketSignal } from 'ngx-oneforall/signals/websocket-signal';

@Component({ ... })
export class ChatComponent {
    socket = webSocketSignal<string>('wss://echo.websocket.org');
    
    constructor() {
        effect(() => {
            const msg = this.socket.messages();
            if (msg) {
                console.log('Received:', msg);
            }
        });
    }
    
    send(text: string) {
        if (this.socket.status() === 'open') {
            this.socket.send(text);
        }
    }
}
```

### Handling Connection Status

```typescript
@Component({
    template: `
        <div [class]="socket.status()">
            Status: {{ '{{' }} socket.status().toUpperCase() {{ '}}' }}
        </div>
        @if (socket.status() === 'open') {
            <button (click)="socket.close()">Disconnect</button>
        }
    `
})
export class StatusComponent {
    socket = webSocketSignal('wss://example.com');
}
```

## API

`webSocketSignal<T>(url: string): WebSocketState<T>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | WebSocket server URL |

### WebSocketState

The returned object provides:

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `messages` | `Signal<T \| null>` | Latest received message |
| `error` | `Signal<Event \| null>` | Latest error event |
| `status` | `Signal<'connecting' \| 'open' \| 'closed' \| 'error'>` | Connection status |
| `send(msg)` | `(msg: T) => void` | Send a message |
| `close()` | `() => void` | Close the connection |

> **Note**
> The connection is automatically closed when the injection context is destroyed.

## When to Use

✅ **Good use cases:**
- Real-time chat applications
- Live notifications
- Stock/crypto price feeds
- Collaborative editing

❌ **Avoid when:**
- You need request/response patterns (use HTTP)
- Server doesn't support WebSocket
- You need complex reconnection logic (use dedicated libraries)
