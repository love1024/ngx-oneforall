import { Component, computed, inject } from '@angular/core';
import { NetworkStatusService } from 'ngx-oneforall/services/network-status';

@Component({
  selector: 'lib-network-status-demo',
  imports: [],
  template: `
    <h2>Network Status Demo</h2>
    <div id="status">
      <h3>Network Status</h3>
      <p>
        Turn off your wifi, or simulate it by selecting 'offline' in the network
        tab in Browser's devtools.
      </p>
      <p>
        <strong>Is Online:</strong>
        {{ isOnline() }}
      </p>
    </div>
  `,
  styleUrl: './network-status-demo.component.scss',
  providers: [NetworkStatusService],
})
export class NetworkStatusDemoComponent {
  isOnline = computed(() => this.networkStatuService.isOnlineSignal());

  private readonly networkStatuService = inject(NetworkStatusService);
}
