import { Component, inject, linkedSignal } from '@angular/core';
import {
  provideSessionStorage,
  SessionStorageService,
  StorageTransformers,
} from '@ngx-oneforall/services';

@Component({
  selector: 'lib-session-storage-service-demo',
  imports: [],
  template: `
    <div class="storage-signal-demo">
      <h2>Session Storage Service</h2>
      <p>
        This demo shows a counter value synchronized with
        <strong>sessionStorage</strong> using
        <code>SessionStorageService</code>.
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
  styleUrl: './session-storage-service-demo.component.scss',
  providers: [provideSessionStorage()],
})
export class SessionStorageServiceDemoComponent {
  key = 'SESSION_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
    () =>
      this.sessionStorageService.get(this.key, StorageTransformers.NUMBER) ?? 0
  );

  private readonly sessionStorageService = inject(SessionStorageService);

  increaseCount() {
    this.count.update(c => c + 1);
    this.sessionStorageService.set(
      this.key,
      this.count(),
      StorageTransformers.NUMBER
    );
  }
}
