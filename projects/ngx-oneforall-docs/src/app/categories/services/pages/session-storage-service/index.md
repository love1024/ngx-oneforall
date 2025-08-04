
The `SessionStorageService` is an Angular service designed to provide a robust, type-safe interface for interacting with the browser's session storage. It implements the `StorageEngine` interface, ensuring a consistent API for storing, retrieving, and managing data within the session storage scope. This service is ideal for scenarios where you need to persist data only for the duration of the browser session, such as temporary user preferences, authentication tokens, or transient application state.

#### Features

- **Type Safety**: Supports generic types, allowing you to store and retrieve strongly-typed data.
- **CRUD Operations**: Provides methods to get, set, check, remove, and clear session storage entries.
- **Encapsulation**: Abstracts direct access to the browser's `sessionStorage`, promoting cleaner and more maintainable code.
- **Serialization**: Automatically serializes and deserializes data using JSON, enabling storage of complex objects.

#### Usage

1. Import and provide the `provideSessionStorage` in your Angular module or component.
2. Inject the service where you need to interact with session storage.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { SessionStorageService, provideSessionStorage } from '@ngx-oneforall/services';

@Component({
    ...
    providers: [provideSessionStorage()]
})
export class SessionStorageDemoComponent {
  key = 'SESSION_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
    () => this.sessionStorageService.get(this.key) ?? 0
  );

  private readonly sessionStorageService = inject(SessionStorageService);

  increaseCount() {
    this.count.update(c => c + 1);
    this.sessionStorageService.set(this.key, this.count());
  }
}
```

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("SessionStorageServiceDemoComponent") }}


#### Type Safe Usage

1. Import and provide the `provideSessionStorage` in your Angular module or component.
2. Use the `injectSessionStorage` function with type to have a type safe session storage.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { SessionStorageService, provideSessionStorage } from '@ngx-oneforall/services';

@Component({
    ...
    providers: [provideSessionStorage()]
})
export class SessionStorageDemoComponent {
  key = 'SESSION_STORAGE_DEMO_COUNT';
  count = linkedSignal<number>(
    () => this.sessionStorageService.get(this.key) ?? 0
  );

  private readonly sessionStorageService = injectSessionStorage<number>();

  increaseCount() {
    this.count.update(c => c + 1);
    // Typescript will throw an error as assigning string to a number
    this.sessionStorageService.set(this.key, '1');
  }
}
```

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("SessionStorageTypedServiceDemoComponent") }}

#### API

- **`get(key: string): T | undefined`**  
    Retrieves and deserializes the value associated with the given key. Returns `undefined` if the key does not exist.

- **`set(key: string, value: T): void`**  
    Serializes and stores the value under the specified key.

- **`has(key: string): boolean`**  
    Checks if a key exists in session storage.

- **`remove(key: string): void`**  
    Removes the entry associated with the given key.

- **`clear(): void`**  
    Clears all entries from session storage.

#### Notes

- The service operates on the browser's `sessionStorage` object, meaning data persists only for the duration of the page session and is cleared when the browser tab is closed.
- All stored values are serialized to JSON, so only serializable data types should be used.
- For persistent storage across sessions, consider using a similar service with `localStorage`.



