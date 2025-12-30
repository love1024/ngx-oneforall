import { Provider } from '@angular/core';
import { ClipboardService } from './clipboard.service';

export function provideClipboardService(): Provider {
  return ClipboardService;
}
