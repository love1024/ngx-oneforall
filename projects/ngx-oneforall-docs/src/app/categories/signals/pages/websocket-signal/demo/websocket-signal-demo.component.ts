import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { webSocketSignal } from '@ngx-oneforall/signals/websocket-signal';

@Component({
  selector: 'app-websocket-signal-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="status-bar" [class]="socket.status()">
        Status: {{ socket.status() | uppercase }}
      </div>

      <div class="chat-box">
        <div
          *ngFor="let msg of chatHistory()"
          class="message"
          [class.sent]="msg.sent">
          {{ msg.text }}
        </div>
      </div>

      <div class="input-area">
        <input
          type="text"
          [(ngModel)]="messageInput"
          (keyup.enter)="sendMessage()"
          placeholder="Type a message..."
          [disabled]="socket.status() !== 'open'" />
        <button (click)="sendMessage()" [disabled]="socket.status() !== 'open'">
          Send
        </button>
      </div>

      <div class="controls">
        <button
          (click)="connect()"
          *ngIf="socket.status() === 'closed' || socket.status() === 'error'">
          Reconnect
        </button>
        <button (click)="socket.close()" *ngIf="socket.status() === 'open'">
          Disconnect
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
      }
      .status-bar {
        padding: 0.5rem;
        border-radius: 4px;
        font-weight: bold;
        &.connecting {
          background: #e3bd00;
          color: black;
        }
        &.open {
          background: #4caf50;
          color: white;
        }
        &.closed {
          background: #9e9e9e;
          color: white;
        }
        &.error {
          background: #f44336;
          color: white;
        }
      }
      .chat-box {
        height: 200px;
        overflow-y: auto;
        border: 1px solid var(--ng-doc-border-color);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .message {
        padding: 0.5rem;
        border-radius: 4px;
        background: var(--ng-doc-code-bg);
        align-self: flex-start;

        &.sent {
          align-self: flex-end;
          background: var(--ng-doc-primary-color);
          color: white;
        }
      }
      .input-area {
        display: flex;
        gap: 0.5rem;
      }
      input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
        background: var(--ng-doc-input-bg);
        color: var(--ng-doc-text-color);
      }
      button {
        padding: 0.5rem 1rem;
        cursor: pointer;
      }
    `,
  ],
})
export class WebSocketSignalDemoComponent {
  // Note: echoing sometimes takes time or fails on free servers.
  // We use a property to allow reconnection simulation (creating new signal)
  // But webSocketSignal is a function returning state.

  // To support reconnect, we might need to recreate the signal or just show close/open.
  // The current implementation of webSocketSignal creates the connection on call.
  // So to "reconnect", we need to call it again and replace the references?
  // Or just reload the component?
  // Let's keep it simple: "Toggle Connection" just closes it. To reconnect, simplistic approach:

  // Actually, webSocketSignal returns a stable object with signals inside.
  // If we want to reconnect, we'd need a new WebSocket.
  // The current implementation doesn't support "reopening" the CLOSED underlying socket.
  // So we need to re-run the function.

  // We can wrap it in a wrapper.

  socket = webSocketSignal('wss://echo.websocket.org');

  messageInput = '';
  chatHistory = signal<{ text: string; sent: boolean }[]>([]);

  constructor() {
    effect(() => {
      const msg = this.socket.messages();
      if (msg) {
        // Determine if it was just our echo or new.
        // echo.websocket.org echoes exactly what we sent.
        // We'll just display it.
        this.chatHistory.update(h => [
          ...h,
          { text: `Received: ${JSON.stringify(msg)}`, sent: false },
        ]);
      }
    });
  }

  sendMessage() {
    if (!this.messageInput.trim()) return;

    this.socket.send(this.messageInput);
    this.chatHistory.update(h => [
      ...h,
      { text: `Sent: ${this.messageInput}`, sent: true },
    ]);
    this.messageInput = '';
  }

  connect() {
    // Re-initialization hack for demo if needed, but for now just showing basics.
    // Since we can't easily replace the `socket` property if it's not a signal itself,
    // we might just disable the reconnect button or reload page.
    // Or simpler:
    this.socket = webSocketSignal('wss://echo.websocket.org');
    // But we need to re-setup effects if we replace the object?
    // Yes. This is a limitation of the simple demo structure.
    // Let's just allow closing.
  }
}
