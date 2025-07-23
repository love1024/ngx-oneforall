import { Component, inject } from '@angular/core';
import {
  CUSTOM_LOGGER,
  CustomLogger,
  LoggerService,
} from '@ngx-oneforall/services';

class APILogger implements CustomLogger {
  log(...args: unknown[]) {
    console.log('CUSTOM LOGGER ---- ', ...args);
  }

  error(...args: unknown[]) {
    console.log('CUSTOM LOGGER ---- ', ...args);
  }

  warn(...args: unknown[]) {
    console.log('CUSTOM LOGGER ---- ', ...args);
  }

  debug(...args: unknown[]) {
    console.log('CUSTOM LOGGER ---- ', ...args);
  }
}

@Component({
  selector: 'lib-logger-custom-service-demo',
  imports: [],
  template: ` <p>Open browser's console to see logger in action.</p> `,
  styleUrl: './logger-service-demo.component.css',
  providers: [LoggerService, { provide: CUSTOM_LOGGER, useClass: APILogger }],
})
export class LoggerServiceCustomDemoComponent {
  private logger = inject(LoggerService);

  constructor() {
    this.logger.log('This is logged using the custom logger');
  }
}
