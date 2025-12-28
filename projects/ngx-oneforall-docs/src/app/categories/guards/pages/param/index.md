`paramGuard` is a functional guard that validates route parameters (path variables) before allowing activation of a route. It works similarly to `queryParamGuard` but for route parameters.

## Usage

To use `paramGuard`, provide it in your route configuration using `canActivate`. It is particularly useful for validating required parameters in routes like `/item/:id`.

```typescript
import { paramGuard } from '@ngx-oneforall/guards/param';

const routes: Routes = [
  {
    path: 'users/:id',
    component: UserComponent,
    canActivate: [
      paramGuard({
        required: ['id'],
        // predicate: (params) => params['id'].startsWith('usr_'),
        redirectTo: '/not-found',
      }),
    ],
  },
];
```

## Configuration

The `paramGuard` factory takes a `ParamGuardConfig` object:

| Property     | Type                                       | Description                                                                 |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| `required`   | `string[]`                                 | List of parameter keys that must be present and non-empty.                  |
| `predicate`  | `(params: Record<string, string>) => boolean` | A custom function to validate parameters.                                   |
| `redirectTo` | `string`                                   | Optional URL to redirect to if validation fails (uses `RedirectCommand`). |

## Demo

{{ NgDocActions.demo("ParamDemoComponent") }}
