

`queryParamGuard` is a functional guard that validates query parameters before allowing activation of a route. It can check for required parameters and apply custom logic via a predicate function.

## Usage

To use `queryParamGuard`, provide it in your route configuration using `canActivate`:

```typescript
import { queryParamGuard } from 'ngx-oneforall/guards/query-param';

const routes: Routes = [
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [
      queryParamGuard({
        required: ['id'],
        predicate: (params) => params['type'] === 'admin',
        redirectTo: '/unauthorized',
      }),
    ],
  },
];
```

## Configuration

The `queryParamGuard` factory takes a `QueryParamGuardConfig` object:

| Property     | Type                                       | Description                                                                 |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| `required`   | `string[]`                                 | List of query parameter keys that must be present and non-empty.            |
| `predicate`  | `(params: Params) => boolean` | A custom function to validate query parameters.                             |
| `redirectTo` | `string`                                   | Optional URL to redirect to if validation fails (uses `RedirectCommand`). |

## Demo

{{ NgDocActions.demo("QueryParamDemoComponent") }}

> **Note**
> If `redirectTo` is not provided, the guard will simply return `false` on failure.
