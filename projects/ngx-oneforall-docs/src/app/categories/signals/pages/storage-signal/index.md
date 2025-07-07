The `storageSignal` utility in Angular provides a reactive way to synchronize application state with browser storage mechanisms such as `localStorage` or `sessionStorage`. It leverages Angular signals to keep your data in sync with storage, enabling seamless state persistence and cross-tab communication.


```typescript
const signalResponse = storageSignal<T>(NAME, DEFAULT_VALUE, OPTIONS);
```

#### Options

The `OPTIONS` parameter is an object that configures how the `storageSignal` behaves. Here are the available options:

- **`storage`** (default: `localStorage`)  
    The storage mechanism to use. Can be `localStorage`, `sessionStorage`, or any custom object implementing the `Storage` interface.  

- **`serializer`** (default: `JSON.stringify`)  
    A function to convert the value to a string before saving it to storage. Useful for custom or complex data types.  

- **`deserializer`** (default: `JSON.parse`)  
    A function to convert the stored string back to the original value when reading from storage.  

- **`crossTabSync`** (default: `false`)  
    If set to `true`, synchronizes the signal's value across multiple browser tabs/windows.  

- **`injector`**  
    An Angular `Injector` instance. Allows the signal to be used outside of Angular's standard injection context.  

#### Key Features

- **Reactive State Persistence:** Automatically keeps a signal's value in sync with browser storage.

    ```typescript
    import { storageSignal } from '@angular/core';

    @Component({
    ...
    })
    export class StorageSignalDemoComponent {
        // Defautl value is localstorage
        count = storageSignal<number>('count', 0);

        increaseCount() {
            // Updates both signal and localStorage
            this.count.update(c => c + 1);
        }
    }
    ```

- **Customizable Storage:** Supports both `localStorage` and `sessionStorage`, or any custom storage implementing the `Storage` interface.

    ```typescript
    // Use sessionStorage instead of localStorage
    const sessionToken = storageSignal<string>('session-token', '', { storage: sessionStorage });
    sessionToken.set('abc123');
    ```

- **Serialization Options:** Allows custom serialization and deserialization logic for complex data types.

    ```typescript
    interface User {
        id: number;
        name: string;
    }

    const users = storageSignal<User[]>(
        'users',
        [],
        {
            storage: localStorage,
            serialize: (value) => JSON.stringify(value),
            deserialize: (value) => value ? JSON.parse(value) : []
        }
    );
    users.set([{ id: 1, name: 'Alice' }]);
    ```

- **Cross-Tab Synchronization:** Optionally synchronizes state changes across multiple browser tabs.

    ```typescript
    const cart = storageSignal<string[]>(
        'cart',
        [],
        { storage: localStorage, crossTabSync: true }
    );
    // Updates in one tab will reflect in all open tabs
    ```

- **Flexible Injection:** Can be used within or outside Angular's injection context by providing an `Injector`.

    ```typescript
    import { storageSignal } from '@angular/core';

    @Component({
    ...
    })
    export class StorageSignalDemoComponent implements OnInit {
        private injector = inject(Injector);

        ngOnInit() {
            // This is outside injection context
            const theme = storageSignal('theme', 'light', { injector });
        }
    }
    ```

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("StorageSignalDemoComponent") }}

