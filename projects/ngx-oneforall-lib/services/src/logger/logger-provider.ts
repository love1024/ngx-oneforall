import { Provider } from '@angular/core';
import { LoggerService } from './logger.service';

export function provideLoggerService(): Provider {
  return LoggerService;
}
