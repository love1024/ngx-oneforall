import { Provider } from '@angular/core';
import { DeviceService } from './device.service';

export function provideDeviceService(): Provider {
  return DeviceService;
}
