![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/constants&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `ngx-oneforall/constants` package provides a set of common time duration constants in milliseconds. These are useful for timeouts, intervals, and date manipulations.

## Usage

Import the `TIME` constant to use in your timers or logic.

```typescript
import { TIME } from 'ngx-oneforall/constants';

// Set an interval of one minute
setInterval(() => {
  console.log('One minute passed');
}, TIME.Minute);

// Calculate three hours in ms
const threeHours = 3 * TIME.Hour;
```

## TIME

All values are represented in **milliseconds**.

| Name | Milliseconds | Value |
| :--- | :--- | :--- |
| **Second** | `1,000` | `1000` |
| **Minute** | `60,000` | `60_000` |
| **Hour** | `3,600,000` | `3_600_000` |
| **Day** | `86,400,000` | `86_400_000` |
| **Week** | `604,800,000` | `604_800_000` |
