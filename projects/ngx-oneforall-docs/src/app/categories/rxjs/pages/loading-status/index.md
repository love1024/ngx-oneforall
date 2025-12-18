`loadingStatus` is an RxJS operator that simplifies tracking the state of an asynchronous operation (like an API call). It automatically catches errors and provides a unified `ResourceResult<T>` object containing the loading status, the data, and any potential error.

## Usage

{{ NgDocActions.demo("LoadingStatusDemoComponent", { container: true }) }}

### Basic Example


In your component, you can then easily handle the different states:

{% raw %}
```html file="./snippet.html"#L1-L13
```
{% endraw %}

## API

`loadingStatus<T>(): OperatorFunction<T, ResourceResult<T>>`

### ResourceResult<T> Interface

```typescript
type ResourceResult<T> = {
    isLoading: boolean;
    status: 'loading' | 'success' | 'error';
    data: T | null;
    error?: unknown;
}
```

### Behavior

- **Initial State**: Immediately emits `{ status: 'loading', data: null, isLoading: true }` upon subscription.
- **Success State**: When the source observable emits data, it transforms it to `{ status: 'success', data: T, isLoading: false }`.
- **Error State**: If the source observable errors, it catches it and emits `{ status: 'error', data: null, error: unknown, isLoading: false }`.

### Benefits

- **Unified State**: No need to manage separate `isLoading`, `error`, and `data` variables or signals.
- **Error Handling**: Automatically catches errors so the stream doesn't terminate unexpectedly (it transforms the error into a value).
- **Type Safety**: Provides a strongly typed result object.
