
The `LocalStorageService` is an Angular service designed to provide a robust, type-safe interface for interacting with the browser's local storage. It implements the `StorageEngine` interface, ensuring a consistent API for storing, retrieving, and managing data within the local storage scope. This service is ideal for scenarios where you need to persist data across browser sessions, such as user preferences, authentication tokens, or persistent application state.

#### Features

- **Type Safety**: Supports generic types, allowing you to store and retrieve strongly-typed data.
- **CRUD Operations**: Provides methods to get, set, check, remove, and clear local storage entries.
- **Encapsulation**: Abstracts direct access to the browser's `localStorage`, promoting cleaner and more maintainable code.
- **Serialization**: Automatically serializes and deserializes data using JSON, enabling storage of complex objects.

#### Usage

1. Import and provide the `provideLocalStorage` in your Angular module or component.
2. Inject the service where you need to interact with local storage.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { LocalStorageService, provideLocalStorage } from '@ngx-oneforall/services';

@Component({
  ...
  providers: [provideLocalStorage()]
})
export class LocalStorageDemoComponent {
  key = 'LOCAL_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
  () => this.localStorageService.get(this.key) ?? 0
  );

  private readonly localStorageService = inject(LocalStorageService);

  increaseCount() {
  this.count.update(c => c + 1);
  this.localStorageService.set(this.key, this.count());
  }
}
```

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("LocalStorageServiceDemoComponent") }}


#### Type Safe Usage

1. Import and provide the `provideLocalStorage` in your Angular module or component.
2. Use the `injectLocalStorage` function with type to have a type safe local storage.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { LocalStorageService, provideLocalStorage } from '@ngx-oneforall/services';

@Component({
  ...
  providers: [provideLocalStorage()]
})
export class LocalStorageDemoComponent {
  key = 'LOCAL_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
  () => this.localStorageService.get(this.key) ?? 0
  );

  private readonly localStorageService = injectLocalStorage<number>();

  increaseCount() {
  this.count.update(c => c + 1);
  // This will throw an error as assigning string to a number
  this.localStorageService.set(this.key, '1');
  }
}
```

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("LocalStorageTypedServiceDemoComponent") }}

#### API

- **`get(key: string): T | undefined`**  
  Retrieves and deserializes the value associated with the given key. Returns `undefined` if the key does not exist.

- **`set(key: string, value: T): void`**  
  Serializes and stores the value under the specified key.

- **`has(key: string): boolean`**  
  Checks if a key exists in local storage.

- **`remove(key: string): void`**  
  Removes the entry associated with the given key.

- **`clear(): void`**  
  Clears all entries from local storage.

#### Notes

- The service operates on the browser's `localStorage` object, meaning data persists across browser sessions and remains until explicitly cleared.
- All stored values are serialized to JSON, so only serializable data types should be used.
- For temporary storage that is cleared when the browser tab is closed, consider using a similar service with `sessionStorage`.

