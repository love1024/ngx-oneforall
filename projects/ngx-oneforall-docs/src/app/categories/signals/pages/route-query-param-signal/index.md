The `routeQueryParamSignal` utility in Angular provides a reactive and declarative way to access and respond to changes in route **query parameters** within your components. By leveraging Angular signals and the router, it enables seamless synchronization between the URL's query parameters and your component state, ensuring your UI always reflects the current navigation context.

#### Access a Single Query Param

```typescript
import { routeQueryParamSignal } from 'path-to-your-utils';

@Component({
    ...
})
export class ExampleComponent {
    // Reactively tracks the value of the 'search' query parameter
    search = routeQueryParamSignal('search');
}
```

#### Access Query Params Map

```typescript
import { routeQueryParamsMapSignal } from 'path-to-your-utils';

@Component({
    ...
})
export class ExampleComponent {
    // Get all query params as a ParamMap
    queryParamsMap = routeQueryParamsMapSignal();
}
```

#### Key Features

- **Reactive Query Parameter Access:**  
    The signal automatically updates when the query parameter changes, eliminating the need for manual subscriptions or imperative code.

- **Integration with Angular Signals:**  
    Works seamlessly with Angular's signal-based reactivity model, making it easy to use in computed signals, effects, and templates.

- **Automatic Cleanup:**  
    The effect ensures that event subscriptions are properly cleaned up, preventing memory leaks.

#### React On Changes

```typescript
@Component({
    ...
})
export class SearchComponent {
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

#### When to Use

- When you need to reactively access query parameters in a signal-based Angular application.
- When you want to avoid manual subscription management for query param changes.
- When building components that depend on dynamic query parameters (e.g., search pages, filters, etc.).
