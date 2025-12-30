---
keyword: HostPlatformPage
---

Detects the host platform/operating system based on the user agent string. SSR-safe with modern iPadOS 13+ detection.

## Usage

```typescript
import { getHostPlatform } from '@ngx-oneforall/utils/host-platform';
import { HostPlatform } from '@ngx-oneforall/constants';

const platform = getHostPlatform();

if (platform === HostPlatform.IOS) {
  // iOS-specific logic (includes iPad)
}
```

## API

`getHostPlatform(): HostPlatform`

Returns one of the following enum values:

| Value | Description |
|-------|-------------|
| `HostPlatform.MAC` | macOS desktop |
| `HostPlatform.IOS` | iPhone, iPad, iPod (including iPadOS 13+) |
| `HostPlatform.WINDOWS` | Windows desktop |
| `HostPlatform.WINDOWS_PHONE` | Windows Phone |
| `HostPlatform.ANDROID` | Android devices |
| `HostPlatform.LINUX` | Linux distributions |
| `HostPlatform.UNKNOWN` | SSR or unrecognized platform |

> **Note**
> iPadOS 13+ reports as "Macintosh" in the user agent. This utility uses touch detection to correctly identify iPads.

## Use Cases

- **Platform-specific UI**: Show different layouts for mobile vs desktop
- **Feature detection**: Enable/disable features based on platform
- **Analytics**: Track user platform distribution
- **Download links**: Show appropriate app store links

## Example: Conditional Rendering

```typescript
@Component({...})
export class AppComponent {
  platform = getHostPlatform();
  
  get isMobile(): boolean {
    return [HostPlatform.IOS, HostPlatform.ANDROID].includes(this.platform);
  }
}
```

## Demo

{{ NgDocActions.demo("HostPlatformDemoComponent", {container: true}) }}

