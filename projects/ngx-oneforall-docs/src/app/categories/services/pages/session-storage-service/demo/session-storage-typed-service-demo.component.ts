import { Component, linkedSignal } from '@angular/core';
import {
  injectSessionStorage,
  provideSessionStorage,
} from '@ngx-oneforall/services';

@Component({
  selector: 'lib-session-storage-typed-service-demo',
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
export class SessionStorageTypedServiceDemoComponent {
  key = 'SESSION_STORAGE_TYPED_DEMO_COUNT';
  count = linkedSignal<number>(
    () => this.sessionStorageService.get(this.key) ?? 0
  );

  private readonly sessionStorageService = injectSessionStorage<number>();

  increaseCount() {
    this.count.update(c => c + 1);
    this.sessionStorageService.set(this.key, this.count());
  }
}
