import { Provider } from '@angular/core';
import { NetworkStatusService } from './network-status.service';

export function provideNetworkStatusService(): Provider {
  return NetworkStatusService;
}
