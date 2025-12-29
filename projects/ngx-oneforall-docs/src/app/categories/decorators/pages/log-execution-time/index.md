The `LogExecutionTime` decorator logs method execution time. Works with sync, Promise, and Observable methods.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | Method name | Custom label for log message |

### Output Format

```
[label] executed in X.XX ms
```

### Features

- **Sync methods**: Logs after return
- **Promises**: Logs after resolution/rejection
- **Observables**: Logs after completion via `finalize()`
- **Global disable**: Turn off logging for production

### Basic Usage

```typescript
@LogExecutionTime()
getData(): Observable<Data> {
  return this.http.get<Data>('/api/data');
}
// Console: [getData] executed in 123.45 ms
```

### Custom Label

```typescript
@LogExecutionTime('FetchUsers')
async getUsers(): Promise<User[]> {
  return await this.api.fetchUsers();
}
// Console: [FetchUsers] executed in 456.78 ms
```

### Disable in Production

```typescript
import { disableLogExecutionTime } from '@ngx-oneforall/decorators/log-execution-time';

// main.ts
if (environment.production) {
  disableLogExecutionTime();
}
```

### Helper Functions

| Function | Description |
|----------|-------------|
| `disableLogExecutionTime()` | Disables logging globally |
| `enableLogExecutionTime()` | Re-enables logging |
| `isLogExecutionTimeEnabled()` | Returns current enabled state |

### Live Demonstration

{{ NgDocActions.demo("LogExecutionTimeDemoComponent") }}
