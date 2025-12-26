import { Component } from '@angular/core';
import { storageSignal } from '@ngx-oneforall/signals/storage-signal';

@Component({
  selector: 'lib-storage-signal-demo',
  imports: [],
  template: `
    <div class="storage-signal-demo">
      <h2>Local Storage Signal Demo</h2>
      <p>
        This demo shows a counter value synchronized with
        <strong>localStorage</strong> using <code>storageSignal</code>.
        <br />
        Increase the count, then refresh or open this page in another tab to see
        the value persist and sync.
      </p>
      <div class="counter-container">
        <span class="count-label">Count:</span>
        <span class="count-value">{{ count() }}</span>
        <button class="increase-btn" (click)="increaseCount()">Increase</button>
      </div>
    </div>
  `,
  styleUrl: 'storage-signal-demo.component.scss',
})
export class StorageSignalDemoComponent {
  count = storageSignal<number>('count', 0, { crossTabSync: true });
  increaseCount() {
    this.count.update(c => c + 1);
  }
}
