import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debouncedSignal } from '@ngx-oneforall/signals/debounced-signal';

@Component({
  selector: 'app-debounced-signal-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="input-group">
        <label>Type something:</label>
        <input
          type="text"
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          placeholder="Search..." />
      </div>

      <div class="results">
        <p><strong>Actual Value:</strong> {{ searchTerm() }}</p>
        <p><strong>Debounced (500ms):</strong> {{ debouncedTerm() }}</p>
      </div>
    </div>
  `,
  styleUrl: './debounced-signal-demo.component.scss',
})
export class DebouncedSignalDemoComponent {
  searchTerm = signal('');
  debouncedTerm = debouncedSignal(this.searchTerm, 500);
}
