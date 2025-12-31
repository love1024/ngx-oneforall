![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/constants&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

---
keyword: HostPlatformsPage
---

The `HostPlatform` enum defines the supported host platforms (operating systems) that can be detected by the `getHostPlatform` utility.

## Usage

Import `HostPlatform` from `ngx-oneforall`:

```typescript
import {HostPlatform} from 'ngx-oneforall/constants';

// Usage with getHostPlatform
const platform = getHostPlatform();

if (platform === HostPlatform.MAC) {
    // macOS specific logic
}
```

## Enum Values

| Member | Value | Description |
|--------|-------|-------------|
| `MAC` | `'MAC'` | macOS |
| `IOS` | `'IOS'` | iOS (iPhone, iPad, iPod) |
| `WINDOWS` | `'WINDOWS'` | Windows |
| `WINDOWS_PHONE` | `'WINDOWS_PHONE'` | Windows Phone |
| `ANDROID` | `'ANDROID'` | Android |
| `LINUX` | `'LINUX'` | Linux |
| `UNKNOWN` | `'UNKNOWN'` | Unknown platform |
