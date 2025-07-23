import { Component, inject } from '@angular/core';
import { DISABLE_LOGGER, LoggerService } from '@ngx-oneforall/services';

@Component({
  selector: 'lib-logger-service-demo',
  imports: [],
  template: ` <p>Open browser's console to see logger in action.</p> `,
  styleUrl: './logger-service-demo.component.css',
  providers: [LoggerService, { provide: DISABLE_LOGGER, useValue: false }],
})
export class LoggerServiceDemoComponent {
  private logger = inject(LoggerService);

  constructor() {
    this.logger.log(
      'DEFAULT LOGGER ----  This is logged using the default logger service'
    );
  }
}
