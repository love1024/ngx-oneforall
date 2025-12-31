![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/route-param-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`routeParamSignal` creates a reactive signal that tracks route parameters. It automatically updates when the URL's route parameters change, eliminating manual subscriptions.

## Usage

Use `routeParamSignal` to reactively access route parameters in signal-based components.

### Single Parameter

```typescript
import { routeParamSignal } from 'ngx-oneforall/signals/route-param-signal';

@Component({ ... })
export class ProductDetailComponent {
    // Tracks the 'id' route parameter
    productId = routeParamSignal('id');
    
    constructor() {
        effect(() => {
            const id = this.productId();
            if (id) {
                this.loadProduct(id);
            }
        });
    }
}
```

### All Parameters

```typescript
import { routeParamsMapSignal } from 'ngx-oneforall/signals/route-param-signal';

@Component({ ... })
export class RouteInfoComponent {
    // Get all route params as ParamMap
    params = routeParamsMapSignal();
    
    constructor() {
        effect(() => {
            const map = this.params();
            console.log('Category:', map.get('category'));
            console.log('ID:', map.get('id'));
        });
    }
}
```

## API

### routeParamSignal

`routeParamSignal(paramName: string): Signal<string | null>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `paramName` | `string` | Name of the route parameter |

Returns a signal with the current parameter value, or `null` if not present.

### routeParamsMapSignal

`routeParamsMapSignal(): Signal<ParamMap>`

Returns a signal containing the full `ParamMap` of route parameters.

> **Note**
> Both signals automatically update when navigation changes the route parameters.

## When to Use

✅ **Good use cases:**
- Detail pages (`/products/:id`)
- Nested routes with parameters
- Dynamic route segments
- Master-detail layouts

❌ **Avoid when:**
- You need query parameters (use `routeQueryParamSignal`)
- You need route data, not params (use `ActivatedRoute.data`)
