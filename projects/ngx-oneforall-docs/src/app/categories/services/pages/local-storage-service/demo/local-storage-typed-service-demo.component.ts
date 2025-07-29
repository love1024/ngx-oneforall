import { Component, linkedSignal } from '@angular/core';
import { injectLocalStorage } from '@ngx-oneforall/services';

@Component({
  selector: 'lib-local-storage-typed-service-demo',
  imports: [],
  template: `<div class="storage-signal-demo">
    <h2>Typed Local Storage</h2>
    <p>
      This demo shows a counter value synchronized with
      <strong>localStorage</strong> using <code>injectLocalStorage</code>.
      <br />
      Increase the count, then refresh or open this page in another tab to see
      the value persist and sync.
    </p>
    <div class="counter-container">
      <span class="count-label">Count:</span>
      <span class="count-value">{{ count() }}</span>
      <button class="increase-btn" (click)="increaseCount()">Increase</button>
    </div>
  </div>`,
  styleUrl: 'local-storage-service-demo.component.scss',
})
export class LocalStorageTypedServiceDemoComponent {
  key = 'LOCAL_TYPED_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
    () => this.localStorageService.get(this.key) ?? 0
  );

  private readonly localStorageService = injectLocalStorage<number>();

  increaseCount() {
    this.count.update(c => c + 1);
    this.localStorageService.set(this.key, this.count());
  }
}
