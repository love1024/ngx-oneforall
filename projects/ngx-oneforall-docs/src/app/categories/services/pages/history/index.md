![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/services/history&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`HistoryService` tracks navigation and provides back navigation with fallback support.

## Features

- **Navigation Tracking** — Tracks route changes after calling `startTracking()`
- **Previous URL** — Access the previous page URL
- **Back with Fallback** — Go back or navigate to fallback if no history
- **Replace Navigation** — Navigate without adding to history
- **SSR Safe** — Does nothing on server-side

---

## Installation

```typescript
import { provideHistoryService, HistoryService } from 'ngx-oneforall/services/history';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHistoryService({ maxSize: 100 }),
  ],
};

// app.component.ts - Start tracking
constructor() {
  inject(HistoryService).startTracking();
}
```

---

## API Reference

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxSize` | `number` | `50` | Maximum history entries to keep |

### Service Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `startTracking()` | `void` | Start tracking navigation events |
| `back()` | `void` | Navigate back if possible |
| `backOrFallback(url)` | `void` | Go back or navigate to fallback URL |
| `forward()` | `void` | Navigate forward |
| `replaceCurrent(url)` | `Promise<boolean>` | Navigate without adding to history |
| `clear()` | `void` | Clear history stack |
| `getHistory()` | `string[]` | Get full history array |

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `currentUrl()` | `string \| null` | Current URL |
| `previousUrl()` | `string \| null` | Previous URL |
| `canGoBack()` | `boolean` | Whether back is possible |
| `length()` | `number` | History stack size |

---

## Basic Usage

```typescript
@Component({...})
export class MyComponent {
  private history = inject(HistoryService);

  goBack() {
    this.history.backOrFallback('/home');
  }

  handleLoginSuccess() {
    // Replace login page in history
    this.history.replaceCurrent('/dashboard');
  }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("HistoryDemoComponent") }}
