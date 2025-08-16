
The `LocalStorageService` is an Angular service that provides a robust, type-safe interface for interacting with the browser's local storage. It implements the `StorageEngine` interface, ensuring a consistent API for storing, retrieving, and managing data within the local storage scope. This service is ideal for scenarios where you need to persist data across browser sessions, such as user preferences, authentication tokens, or persistent application state.

#### Features

- **Type Safety**: Supports different types, allowing you to store and retrieve strongly-typed data.
- **CRUD Operations**: Provides methods to get, set, check, remove, and clear local storage entries.
- **Encapsulation**: Abstracts direct access to the browser's `localStorage`, promoting cleaner and more maintainable code.
- **Serialization**: Offers various options for serialization and deserialization, enabling storage of complex objects.

#### Usage

1. Import and provide the `provideLocalStorage` in your Angular module or component.
2. Inject the service where you need to interact with local storage.

#### Example

> **Note**
> By default, all calls to get and set are of type string.

```typescript
import { Component, inject } from '@angular/core';
import { LocalStorageService, provideLocalStorage } from '@ngx-oneforall/services';

@Component({
  ...
  providers: [provideLocalStorage()]
})
export class LocalStorageDemoComponent {
  key = 'LOCAL_STORAGE_DEMO_NAME';
  name = linkedSignal<string>(
    () => this.localStorageService.get(this.key) ?? ''
  );

  private readonly localStorageService = inject(LocalStorageService);

  updateName(updatedName: string) {
    this.name.set(updatedName);
    this.localStorageService.set(this.key, this.name());
  }
}
```

#### Transformers

The storage service provides built-in support for various data types other than string using transformers. These transformers serialize and deserialize data before storing to local storage. The library provides the following transformers:

1. JSON
2. Number
3. Boolean
4. Date
5. Base64
6. String (Default)

Transformers can be provided as the second parameter and will enforce the mentioned type.

```typescript {4,8}
import { StorageTransformers } from '@ngx-oneforall/services';
...
constructor() {
  this.count = this.localStorageService.get(this.key, StorageTransformers.NUMBER)
}

updateCount(count: number) {
  this.localStorageService.set(this.key, count, StorageTransformers.NUMBER);
}
```

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("LocalStorageServiceDemoComponent") }}

#### Notes

- The service operates on the browser's `localStorage` object, meaning data persists across browser sessions and remains until explicitly cleared.
- For temporary storage that is cleared when the browser tab is closed, consider using a similar service with `sessionStorage`.

