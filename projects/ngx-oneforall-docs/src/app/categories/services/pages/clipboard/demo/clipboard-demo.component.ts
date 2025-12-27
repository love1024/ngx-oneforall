import { Component, inject, signal } from '@angular/core';
import { ClipboardService } from '@ngx-oneforall/services/clipboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-clipboard-demo',
  imports: [FormsModule],
  template: `
    <h2>Clipboard Service Demo</h2>
    <div class="demo-container">
      <div class="input-group">
        <label for="copyInput">Text to Copy:</label>
        <input
          id="copyInput"
          type="text"
          [(ngModel)]="textToCopy"
          placeholder="Enter text to copy" />
        <button (click)="copyText()">Copy</button>
      </div>
      @if (copyStatus()) {
        <p class="status">{{ copyStatus() }}</p>
      }
      <div class="input-group">
        <button (click)="readText()">Read from Clipboard</button>
        <p><strong>Clipboard Content:</strong> {{ clipboardContent() }}</p>
      </div>
    </div>
  `,
  styles: `
    .demo-container {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .input-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex: 1;
    }
    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    .status {
      font-size: 0.9rem;
      color: green;
    }
  `,
  providers: [ClipboardService],
})
export class ClipboardDemoComponent {
  textToCopy = '';
  copyStatus = signal('');
  clipboardContent = signal('');

  private readonly clipboardService = inject(ClipboardService);

  async copyText() {
    const success = await this.clipboardService.copy(this.textToCopy);
    if (success) {
      this.copyStatus.set('Text copied successfully!');
      setTimeout(() => this.copyStatus.set(''), 2000);
    } else {
      this.copyStatus.set('Failed to copy text.');
    }
  }

  async readText() {
    const text = await this.clipboardService.read();
    this.clipboardContent.set(text);
  }
}
