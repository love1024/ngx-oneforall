import { Component, inject, linkedSignal } from '@angular/core';
import {
  LocalStorageService,
  provideLocalStorage,
  StorageTransformers,
} from '@ngx-oneforall/services/storage';

@Component({
  selector: 'lib-local-storage-service-demo',
  imports: [],
  template: ` <div class="storage-signal-demo">
    <h2>Local Storage Service</h2>
    <p>
      This demo shows a counter value synchronized with
      <strong>localStorage</strong> using <code>LocalStorageService</code>.
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
  providers: [provideLocalStorage()],
})
export class LocalStorageServiceDemoComponent {
  key = 'LOCAL_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
    () =>
      this.localStorageService.get(this.key, StorageTransformers.NUMBER) ?? 0
  );

  private readonly localStorageService = inject(LocalStorageService);

  increaseCount() {
    this.count.update(c => c + 1);
    this.localStorageService.set(
      this.key,
      this.count(),
      StorageTransformers.NUMBER
    );
  }
}
