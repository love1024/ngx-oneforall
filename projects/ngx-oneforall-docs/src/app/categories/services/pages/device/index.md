`DeviceService` provides a reliable, cross-platform way to detect the current device type (`mobile | tablet | desktop`) and screen orientation (`portrait | landscape`). It combines several detection strategies to be accurate across modern browsers and devices:

- Prefer native hints when available (`navigator.userAgentData`).
- Handle modern iPadOS which reports as `Macintosh` but is touch-capable.
- Fall back to UA regex and touch/size heuristics (minimum side length) for tablet vs mobile.
- Exposes a readonly signal for reactive templates (Angular signals) and classic getters for imperative use.

Features
--------
- Detect device type: `mobile`, `tablet`, or `desktop`.
- Detect orientation: `portrait` or `landscape`.
- Exposes a readonly signal for use in templates and `deviceType` / `orientation` getters for code.
- Safe to use with server rendering — subscriptions to window events are only created in browser platform.

Provide the service
-------------------
Register the service at the module or component level using the provided factory:

```ts
import { provideDeviceService } from '@ngx-oneforall/services';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [provideDeviceService()],
  template: `...`,
})
export class AppComponent {}
```

Inject and read device info (imperative)
----------------------------------------
Inject `DeviceService` and consume the getters or helper methods in components or services:

```ts
import { Component, inject } from '@angular/core';
import { DeviceService } from '@ngx-oneforall/services';

@Component({ /* ... */ })
export class ExampleComponent {
  private readonly device = inject(DeviceService);

  get deviceType() {
    return this.device.deviceType; // 'mobile' | 'tablet' | 'desktop' | null
  }

  get orientation() {
    return this.device.orientation; // 'portrait' | 'landscape' | null
  }

  isMobile() { return this.device.isMobile(); }
  isTablet() { return this.device.isTablet(); }
  isDesktop() { return this.device.isDesktop(); }
}
```

Reactive templates with signals (recommended for Angular 16+)
-------------------------------------------------------------
`DeviceService` exposes a readonly signal (via `deviceInfoSignal`) that you can use directly in standalone or component templates to react to runtime changes without manual subscriptions:

```html file="./snippets.html"#L1-L24
```

Lifecycle and platform notes
----------------------------
- `DeviceService` only subscribes to `resize` / `orientationchange` events when running in the browser (uses `PLATFORM_ID`). In server-side rendering (SSR) the service will not create window event subscriptions.
- You may provide the service at any scope — global (app) or per-component — depending on whether you want a single shared instance or isolated behavior for a demo component.


Common usage scenarios
----------------------
- Adjust layout or feature flags based on `isMobile()` / `isTablet()` / `isDesktop()`.
- Show device-specific tips, controls, or accessibility hints (e.g. touch tooltips).
- Bind to `deviceInfoSignal` directly in templates for responsive UI updates.

API summary
-----------
- `deviceInfo: DeviceInfo | null` — current device info object ({ type, orientation }).
- `deviceType: 'mobile' | 'tablet' | 'desktop' | null` — current device type.
- `orientation: 'portrait' | 'landscape' | null` — current orientation.
- `deviceInfoSignal` — readonly signal<DeviceInfo | null> for templates.
- `isMobile(): boolean` — true when current device is mobile.
- `isTablet(): boolean` — true when current device is tablet.
- `isDesktop(): boolean` — true when current device is desktop.

Live demo
---------
Explore an interactive demo component that displays the current device type and orientation:

{{ NgDocActions.demo("DeviceServiceDemoComponent") }}
