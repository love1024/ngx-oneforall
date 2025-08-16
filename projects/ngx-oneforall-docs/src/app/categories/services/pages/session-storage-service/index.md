
The `SessionStorageService` is an Angular service designed to provide a robust, type-safe interface for interacting with the browser's session storage. It implements the `StorageEngine` interface, ensuring a consistent API for storing, retrieving, and managing data within the session storage scope. This service is ideal for scenarios where you need to persist data only for the duration of the browser session, such as temporary user preferences, authentication tokens, or transient application state.

#### Features

- **Type Safety**: Supports different types, allowing you to store and retrieve strongly-typed data.
- **CRUD Operations**: Provides methods to get, set, check, remove, and clear session storage entries.
- **Encapsulation**: Abstracts direct access to the browser's `sessionStorage`, promoting cleaner and more maintainable code.
- **Serialization**: Providers various options for serialization and deserialization, enabling storage of complex objects.

#### Usage

1. Import and provide the `provideSessionStorage` in your Angular module or component.
2. Inject the service where you need to interact with session storage.



#### Example

> **Note**
> By default, all calls to get and set are of type string.

```typescript
import { Component, inject } from '@angular/core';
import { SessionStorageService, provideSessionStorage } from '@ngx-oneforall/services';

@Component({
    ...
    providers: [provideSessionStorage()]
})
export class SessionStorageDemoComponent {
  key = 'SESSION_STORAGE_DEMO_NAME';
  name = linkedSignal<string>(
    () => this.sessionStorageService.get(this.key) ?? 0
  );

  private readonly sessionStorageService = inject(SessionStorageService);

  updateName(updatedName: string) {
    this.name.set(updatedName);
    this.sessionStorageService.set(this.key, this.name());
  }
}
```

#### Transformers
Storage service provides inbuilt support for various data types other than a string using transformers. These transformers serialize and deserialize data before storing to a storage. Library provides the following transformers:

1. JSON
2. Number
3. Boolean
4. Date
5. Base64
6. String (Default)

These transformers can be provided as the second parameter and will enforce the mentioned type.

```typescript {4,8}
  import { StorageTransformers } from '@ngx-oneforall/services';
  ...
  constructor() {
    this.count = this.sessionStorageService.get(this.key, StorageTransformers.NUMBER)
  }

  updateCount(count: number) {
    this.sessionStorageService.set(this.key, count, StorageTransformers.NUMBER);
  }
}
```


#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("SessionStorageServiceDemoComponent") }}



#### Notes

- The service operates on the browser's `sessionStorage` object, meaning data persists only for the duration of the page session and is cleared when the browser tab is closed.
- For persistent storage across sessions, consider using a similar service with `localStorage`.



