![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/services/idle&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common"]}})

`IdleService` detects user inactivity based on DOM events (mouse, keyboard, touch, scroll).

## Features

- **Signal & Observable API** — Exposes `isIdle` signal and `isIdle$` observable
- **Configurable** — Customize timeout duration and monitored events
- **SSR Safe** — No listeners attached on server
- **Passive Events** — Uses passive event listeners for better performance
- **Auto Cleanup** — Automatically stops on component/service destroy
---

## Usage

```typescript
import { IdleService, provideIdleService } from 'ngx-oneforall/services/idle';

@Component({
  providers: [provideIdleService({ timeout: 60000 })], // 1 minute
})
export class AppComponent {
  private idle = inject(IdleService);

  constructor() {
    this.idle.start();

    effect(() => {
      if (this.idle.isIdle()) {
        console.log('User is idle!');
      }
    });
  }
}
```

You can also provide it at the application level in `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideIdleService({ timeout: 300000 }), // 5 minutes
  ],
};
```

---

## Runtime Configuration

Use `configure()` to override settings at runtime. If monitoring is already running, it will automatically restart with the new options:

```typescript
// Change timeout dynamically
this.idle.configure({ timeout: 120000 }); // 2 minutes

// Change monitored events
this.idle.configure({ 
  events: ['mousemove', 'keydown', 'click'] 
});

// Change both
this.idle.configure({ 
  timeout: 30000,
  events: ['mousemove', 'touchstart'] 
});
```

---

## API

### Methods

| Method | Description |
|--------|-------------|
| `configure(options)` | Set timeout and events to monitor |
| `start()` | Start monitoring for activity |
| `stop()` | Stop monitoring |
| `reset()` | Reset idle timer |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isIdle` | `Signal<boolean>` | Current idle state |
| `isIdle$` | `Observable<boolean>` | Observable stream |

### Monitored Events

By default, the service listens for the following DOM events to detect user activity:

- `mousemove` - Mouse movement
- `keydown` - Keyboard input
- `touchstart` - Touch interactions
- `scroll` - Page scrolling
- `click` - Mouse clicks

You can customize these via the `events` option in `IdleOptions`.

### IdleOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `300000` (5min) | Idle timeout in ms |
| `events` | `string[]` | `['mousemove', 'keydown', 'touchstart', 'scroll', 'click']` | Events to monitor |

## Demo

{{ NgDocActions.demo("IdleDemoComponent", { container: true }) }}

