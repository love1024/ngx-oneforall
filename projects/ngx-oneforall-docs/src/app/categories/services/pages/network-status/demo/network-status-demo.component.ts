import { Component, computed, inject } from '@angular/core';
import { NetworkStatusService } from '@ngx-oneforall/services';

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
  styles: `
    #status {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    #status h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    #status p {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #555;
    }
    #status strong {
      font-weight: bold;
      color: #000;
    }
  `,
  providers: [NetworkStatusService],
})
export class NetworkStatusDemoComponent {
  isOnline = computed(() => this.networkStatuService.isOnlineSignal());

  private readonly networkStatuService = inject(NetworkStatusService);
}
