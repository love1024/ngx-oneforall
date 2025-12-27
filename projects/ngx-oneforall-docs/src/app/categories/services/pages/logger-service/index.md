Configurable logging service with support for disabling and custom logger implementations.

## Features

- **4 Log Levels** — `log`, `error`, `warn`, `debug`
- **Disable Logging** — Completely disable in production
- **Custom Logger** — Replace console with your own implementation (e.g., send to server)
- **Type-Safe** — Full TypeScript support

---

## Installation

```typescript
import { 
  LoggerService, 
  provideLoggerService,
  DISABLE_LOGGER,
  CUSTOM_LOGGER,
  CustomLogger
} from '@ngx-oneforall/services/logger';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { LoggerService, provideLoggerService } from '@ngx-oneforall/services/logger';

@Component({
  selector: 'app-demo',
  template: `<button (click)="onClick()">Log</button>`,
  providers: [provideLoggerService()],
})
export class DemoComponent {
  private logger = inject(LoggerService);

  onClick() {
    this.logger.log('User clicked button');
    this.logger.debug('Debug info', { timestamp: Date.now() });
    this.logger.warn('This is a warning');
    this.logger.error('Something went wrong!');
  }
}
```

---

## API Reference

| Method | Description |
|--------|-------------|
| `log(...args)` | Standard console.log |
| `error(...args)` | console.error |
| `warn(...args)` | console.warn |
| `debug(...args)` | console.debug |

---

## Disable Logging

Disable all logging (useful for production):

```typescript
import { DISABLE_LOGGER, provideLoggerService } from '@ngx-oneforall/services/logger';

bootstrapApplication(AppComponent, {
  providers: [
    provideLoggerService(),
    { provide: DISABLE_LOGGER, useValue: true },
  ],
});
```

When disabled, all log methods become no-ops.

---

## Custom Logger

Replace the default console with your own implementation:

```typescript
import { CUSTOM_LOGGER, CustomLogger, provideLoggerService } from '@ngx-oneforall/services/logger';

const serverLogger: CustomLogger = {
  log: (...args) => sendToServer('log', args),
  error: (...args) => sendToServer('error', args),
  warn: (...args) => sendToServer('warn', args),
  debug: (...args) => {}, // Suppress debug in production
};

bootstrapApplication(AppComponent, {
  providers: [
    provideLoggerService(),
    { provide: CUSTOM_LOGGER, useValue: serverLogger },
  ],
});
```

---

## CustomLogger Interface

```typescript
interface CustomLogger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}
```

---

## Priority

1. If `DISABLE_LOGGER` is `true` → All methods are no-ops
2. If `CUSTOM_LOGGER` is provided → Uses custom implementation
3. Otherwise → Uses `console` methods

---

## Live Demo

{{ NgDocActions.demo("LoggerServiceDemoComponent") }}

### Custom Logger Demo

{{ NgDocActions.demo("LoggerServiceCustomDemoComponent") }}