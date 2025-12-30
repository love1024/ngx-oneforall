`liveSearch` is an RxJS operator for implementing live search functionality with automatic debouncing, duplicate filtering, and request cancellation.

It combines `debounceTime`, `distinctUntilChanged`, and `switchMap` to provide an optimal search experience.

## Usage

{{ NgDocActions.demo("LiveSearchDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { FormControl } from '@angular/forms';
import { liveSearch } from 'ngx-oneforall/rxjs/live-search';

export class SearchComponent {
    searchControl = new FormControl('', { nonNullable: true });

    ngOnInit() {
        this.searchControl.valueChanges.pipe(
            liveSearch(300, (query) => this.searchAPI(query))
        ).subscribe(results => {
            console.log('Search results:', results);
        });
    }

    private searchAPI(query: string) {
        return this.http.get(`/api/search?q=${query}`);
    }
}
```

### With HttpClient

```typescript
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { liveSearch } from 'ngx-oneforall/rxjs/live-search';

export class ProductSearchComponent {
    searchControl = new FormControl('');
    results$ = this.searchControl.valueChanges.pipe(
        liveSearch(500, (query) => this.searchProducts(query))
    );

    constructor(private http: HttpClient) {}

    private searchProducts(query: string) {
        return this.http.get<Product[]>(`/api/products/search`, {
            params: { q: query }
        });
    }
}
```

## API

`liveSearch<T>(delay: number, dataProducer: (query: string) => Observable<T>)`

### Parameters

- **delay**: Debounce delay in milliseconds
- **dataProducer**: A function that takes the query string and returns an Observable of search results

### Behavior

- Debounces input to reduce API calls
- Filters out consecutive duplicate values
- Automatically cancels previous search requests when a new one is initiated
- The delay is specified in **milliseconds**

### Benefits

- Reduces server load by debouncing rapid input changes
- Prevents duplicate searches
- Always shows the most recent search results
- Handles race conditions automatically
