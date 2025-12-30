import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  EncryptionAdapter,
  useEncryption,
} from 'ngx-oneforall/interceptors/encryption';

interface Message {
  id: number;
  content: string;
  encrypted?: boolean;
}

// Simple Base64 encryption adapter for demo purposes
class Base64EncryptionAdapter implements EncryptionAdapter {
  encrypt(data: unknown): unknown {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }

  decrypt(data: unknown): unknown {
    const decoded = atob(data as string);
    return JSON.parse(decoded);
  }
}

@Component({
  selector: 'lib-encryption-interceptor-demo',
  template: `
    <div class="container">
      <h3>Encryption Interceptor Demo</h3>
      <p class="description">
        The interceptor automatically encrypts request payloads and decrypts
        responses using a configurable adapter. This demo uses Base64 encoding
        for simplicity.
      </p>

      <div class="adapter-info">
        <strong>Current Adapter:</strong>
        <code>Base64EncryptionAdapter</code>
        <p class="note">
          In production, use a secure encryption algorithm like AES-256.
        </p>
      </div>

      <div class="actions">
        <button class="action-btn send" (click)="sendEncryptedMessage()">
          Send Encrypted Message
        </button>
        <button class="action-btn receive" (click)="receiveEncryptedResponse()">
          Receive Encrypted Response
        </button>
        <button class="action-btn disabled" (click)="sendUnencrypted()">
          Send without Encryption
        </button>
        <button class="clear-btn" (click)="clearMessages()">
          Clear Messages
        </button>
      </div>

      @if (messages().length > 0) {
        <div class="messages-container">
          <h4>Message Log</h4>
          <div class="messages-list">
            @for (msg of messages(); track msg.id) {
              <div class="message-card" [class.encrypted]="msg.encrypted">
                <div class="message-header">
                  <span class="message-id">#{{ msg.id }}</span>
                  <span class="encryption-badge" [class.active]="msg.encrypted">
                    {{ msg.encrypted ? 'Encrypted' : 'Plain' }}
                  </span>
                </div>
                <div class="message-content">{{ msg.content }}</div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="empty-state">
          No messages yet. Click a button above to simulate encrypted
          communication.
        </div>
      }
    </div>
  `,
  styleUrls: ['./encryption-interceptor-demo.scss'],
})
export class EncryptionInterceptorDemoComponent {
  private readonly http = inject(HttpClient);
  messages = signal<Message[]>([]);
  private messageId = 1;

  sendEncryptedMessage() {
    const message = `Encrypted message sent at ${new Date().toLocaleTimeString()}`;

    // Simulate sending encrypted message
    this.addMessage({
      id: this.messageId++,
      content: `📤 Sent: ${message}`,
      encrypted: true,
    });

    // Note: In a real app with the interceptor configured:
    // this.http.post('/api/messages', { text: message }).subscribe();
  }

  receiveEncryptedResponse() {
    const message = `Encrypted response received at ${new Date().toLocaleTimeString()}`;

    // Simulate receiving encrypted response
    this.addMessage({
      id: this.messageId++,
      content: `📥 Received: ${message}`,
      encrypted: true,
    });

    // Note: In a real app with the interceptor configured:
    // this.http.get('/api/messages/latest').subscribe();
  }

  sendUnencrypted() {
    const message = `Plain message sent at ${new Date().toLocaleTimeString()}`;

    // Simulate sending without encryption using context
    this.addMessage({
      id: this.messageId++,
      content: `📤 Sent (unencrypted): ${message}`,
      encrypted: false,
    });

    // Note: In a real app:
    // this.http.post('/api/public', { text: message }, {
    //   context: useEncryption({ enabled: false })
    // }).subscribe();
  }

  clearMessages() {
    this.messages.set([]);
    this.messageId = 1;
  }

  private addMessage(msg: Message) {
    this.messages.update(msgs => [msg, ...msgs]);
  }
}
