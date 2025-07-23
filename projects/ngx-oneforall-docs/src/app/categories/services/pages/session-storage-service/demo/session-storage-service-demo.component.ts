import { Component, inject, linkedSignal } from '@angular/core';
import { SessionStorageService } from '@ngx-oneforall/services';

@Component({
  selector: 'lib-session-storage-service-demo',
  imports: [],
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increaseCount()">Increase</button>
  `,
  styleUrl: './session-storage-service-demo.component.scss',
})
export class SessionStorageServiceDemoComponent {
  count = linkedSignal<number>(
    () => this.sessionStorageService.get('Count') ?? 0
  );

  private readonly sessionStorageService = inject(SessionStorageService);

  increaseCount() {
    this.count.update(c => c + 1);

    this.sessionStorageService.set('Count', this.count());
  }
}
