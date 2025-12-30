The `ngx-oneforall/constants` package provides a constant for categorizing devices by type, which is useful for conditional logic based on the platform.

## Usage

Import the `DEVICE_TYPE` constant to use in your components or services.

```typescript
import { DEVICE_TYPE } from 'ngx-oneforall/constants';

// Example: Handling logic based on device type
if (currentDevice() === DEVICE_TYPE.Mobile) {
  // Mobile specific logic
}
```

## DEVICE_TYPE

| Name | Value |
| :--- | :--- |
| **Mobile** | `'mobile'` |
| **Tablet** | `'tablet'` |
| **Desktop** | `'desktop'` |
