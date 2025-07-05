import { Component, inject, Injector } from '@angular/core';
import { storageSignal } from '@ngx-oneforall/signals';

@Component({
  selector: 'lib-storage-signal-demo',
  imports: [],
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increaseCount()">Increase</button>
  `,
  styleUrl: './storage-signal-demo.component.scss',
})
export class StorageSignalDemoComponent {
  count = storageSignal<number>('name', 0);

  private readonly injector = inject(Injector);

  increaseCount() {
    this.count.update(c => c + 1);
  }
}
