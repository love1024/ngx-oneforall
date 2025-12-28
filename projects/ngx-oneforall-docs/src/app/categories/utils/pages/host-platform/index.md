---
keyword: HostPlatformPage
---

The `getHostPlatform` utility allows you to detect the current host platform (OS) based on the user agent. It returns a value from the `HostPlatform` enum.

## Usage

Import `getHostPlatform` and `HostPlatform` from `ngx-oneforall`:

```typescript
import {getHostPlatform} from '@ngx-oneforall/utils/host-platform';
import {HostPlatform} from '@ngx-oneforall/constants';

const platform = getHostPlatform();

if (platform === HostPlatform.MAC) {
    console.log('Running on macOS');
}
```

## Supported Platforms

The `HostPlatform` enum supports the following platforms:

- `MAC`
- `IOS`
- `WINDOWS`
- `WINDOWS_PHONE`
- `ANDROID`
- `LINUX`
- `UNKNOWN`

## Demo

{{ NgDocActions.demo("HostPlatformDemoComponent", {container: true}) }}
