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
  styleUrl: './websocket-signal-demo.component.scss',
})
export class WebSocketSignalDemoComponent {
  socket = webSocketSignal('wss://echo.websocket.org');

  messageInput = '';
  chatHistory = signal<{ text: string; sent: boolean }[]>([]);

  constructor() {
    effect(() => {
      const msg = this.socket.messages();
      if (msg) {
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
    this.socket = webSocketSignal('wss://echo.websocket.org');
  }
}
