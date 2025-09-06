import { Component, inject, signal } from '@angular/core';
import { CacheService, provideCacheService } from '@ngx-oneforall/services';

@Component({
  selector: 'lib-cache-service-demo',
  template: `
    <div class="cache-demo-container">
      <h2>Promo Code</h2>
      <div class="promo-code">{{ code() }}</div>
      <span class="promo-info">Available for <strong>10 seconds</strong></span>
      <div class="availability">
        <div class="label">Availability:</div>
        <span
          [class.available]="isAvailable() === true"
          [class.unavailable]="isAvailable() === false">
          {{
            isAvailable() === null
              ? '-'
              : isAvailable()
                ? 'Available'
                : 'Unavailable'
          }}
        </span>
      </div>
      <button class="check-btn" (click)="checkAgain()">
        Check Availability
      </button>
    </div>
  `,
  styleUrl: 'cache-service-demo.component.scss',
  providers: [
    provideCacheService({
      ttl: 10000,
    }),
  ],
})
export class CacheServiceDemoComponent {
  code = signal('b25lZm9yYWxs');
  isAvailable = signal<null | boolean>(null);

  private cacheService = inject(CacheService);

  constructor() {
    this.cacheService.set('isAvailable', true);
  }

  checkAgain(): void {
    this.isAvailable.set(this.cacheService.get('isAvailable') ?? false);
    setTimeout(() => this.isAvailable.set(null), 2000);
  }
}
