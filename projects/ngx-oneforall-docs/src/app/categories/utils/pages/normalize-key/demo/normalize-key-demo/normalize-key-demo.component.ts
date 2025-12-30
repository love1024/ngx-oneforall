import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { normalizeKey } from '@ngx-oneforall/utils/normalize-key';

@Component({
  selector: 'normalize-key-demo',
  template: `
    <div class="demo-container">
      <div class="input-group">
        <label>Type any key or modifier:</label>
        <input
          type="text"
          [value]="inputValue()"
          (keydown)="onKeydown($event)"
          placeholder="Press any key..." />
      </div>

      <div class="result">
        <p>
          <strong>Original Key:</strong> <code>{{ originalKey() }}</code>
        </p>
        <p>
          <strong>Normalized Key:</strong> <code>{{ normalizedKey() }}</code>
        </p>
      </div>

      <div class="examples">
        <h4>Examples:</h4>
        <ul>
          <li><code>space</code> → <code>' '</code></li>
          <li><code>esc</code> → <code>escape</code></li>
          <li><code>up</code> → <code>arrowup</code></li>
          <li><code>meta</code> (on Windows) → <code>control</code></li>
        </ul>
      </div>
    </div>
  `,
  styleUrl: './normalize-key-demo.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalizeKeyDemoComponent {
  inputValue = signal('');
  originalKey = signal('');
  normalizedKey = signal('');

  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    this.inputValue.set(event.key);
    this.originalKey.set(event.key);
    this.normalizedKey.set(normalizeKey(event.key));
  }
}
