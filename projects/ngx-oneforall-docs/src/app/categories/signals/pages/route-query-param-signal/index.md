![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/route-query-param-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`routeQueryParamSignal` creates a reactive signal that tracks URL query parameters. It automatically updates when query strings change, eliminating manual subscriptions.

## Usage

Use `routeQueryParamSignal` to reactively access query parameters in signal-based components.

### Single Query Parameter

```typescript
import { routeQueryParamSignal } from 'ngx-oneforall/signals/route-query-param-signal';

@Component({ ... })
export class SearchComponent {
    // Tracks the 'q' query parameter (?q=value)
    searchTerm = routeQueryParamSignal('q');
    
    constructor() {
        effect(() => {
            const term = this.searchTerm();
            if (term) {
                this.performSearch(term);
            }
        });
    }
}
```

### All Query Parameters

```typescript
import { routeQueryParamsMapSignal } from 'ngx-oneforall/signals/route-query-param-signal';

@Component({ ... })
export class FilterComponent {
    // Get all query params as ParamMap
    queryParams = routeQueryParamsMapSignal();
    
    constructor() {
        effect(() => {
            const map = this.queryParams();
            console.log('Sort:', map.get('sort'));
            console.log('Page:', map.get('page'));
        });
    }
}
```

## API

### routeQueryParamSignal

`routeQueryParamSignal(paramName: string): Signal<string | null>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `paramName` | `string` | Name of the query parameter |

Returns a signal with the current parameter value, or `null` if not present.

### routeQueryParamsMapSignal

`routeQueryParamsMapSignal(): Signal<ParamMap>`

Returns a signal containing the full `ParamMap` of query parameters.

> **Note**
> Both signals automatically update when navigation changes the query string.

## When to Use

✅ **Good use cases:**
- Search pages (`?q=angular`)
- Filter and sort controls
- Pagination (`?page=2`)
- Shareable URLs with state

❌ **Avoid when:**
- You need route path parameters (use `routeParamSignal`)
- You need fragment data (use `ActivatedRoute.fragment`)
