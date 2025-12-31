![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/services/device&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Detect device type and orientation with automatic updates on resize and orientation changes.

## Features

- **Device Type Detection** — Detect `mobile`, `tablet`, or `desktop`
- **Orientation Detection** — Detect `portrait` or `landscape`
- **Reactive Signal** — Exposes `deviceInfoSignal` for template bindings
- **SSR Safe** — No window subscriptions on server

---

## Installation

```typescript
import { DeviceService, provideDeviceService } from 'ngx-oneforall/services/device';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { DeviceService, provideDeviceService } from 'ngx-oneforall/services/device';

@Component({
  selector: 'app-demo',
  template: `
    @if (device.deviceInfoSignal(); as info) {
      <p>Type: {{ info.type }}</p>
      <p>Orientation: {{ info.orientation }}</p>
    }
  `,
  providers: [provideDeviceService()],
})
export class DemoComponent {
  device = inject(DeviceService);
}
```

---

## API Reference

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `deviceInfo` | `DeviceInfo \| null` | Current device info object |
| `deviceType` | `DeviceType \| null` | `'mobile'` \| `'tablet'` \| `'desktop'` |
| `orientation` | `Orientation \| null` | `'portrait'` \| `'landscape'` |
| `deviceInfoSignal` | `Signal<DeviceInfo \| null>` | Reactive signal for templates |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isMobile()` | `boolean` | True if device is mobile |
| `isTablet()` | `boolean` | True if device is tablet |
| `isDesktop()` | `boolean` | True if device is desktop |
| `isPortrait()` | `boolean` | True if orientation is portrait |
| `isLandscape()` | `boolean` | True if orientation is landscape |

---

## Types

```typescript
interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
}
```

---

## Detection Strategy

1. **userAgentData** — Most accurate (Chromium browsers)
2. **iPadOS detection** — Handles iPadOS 13+ (reports as Macintosh)
3. **User Agent regex** — Fallback pattern matching
4. **Touch + screen size** — Final fallback for unknown devices

---

## SSR Behavior

On server-side rendering:
- `deviceInfo`, `deviceType`, `orientation` return `null`
- No window event subscriptions are created

---

## Live Demo

{{ NgDocActions.demo("DeviceServiceDemoComponent") }}
