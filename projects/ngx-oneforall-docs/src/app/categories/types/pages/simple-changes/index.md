A type-safe version of Angular's `SimpleChanges` that provides proper typing for `ngOnChanges` lifecycle hook. Eliminates the need for type assertions when accessing change properties.

## Usage

```typescript
import { SimpleChangesTyped } from '@ngx-oneforall/types';
```

## API

```typescript
type SimpleChangesTyped<T> = {
  [P in keyof T]?: ComponentChange<T, P>;
};

interface ComponentChange<T, P extends keyof T> {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
  isFirstChange(): boolean;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `previousValue` | `T[P]` | The previous value before the change |
| `currentValue` | `T[P]` | The current value after the change |
| `firstChange` | `boolean` | True if this is the initial binding |
| `isFirstChange()` | `() => boolean` | Returns true if this is the initial binding |

> **Note**
> All properties are optional (`?`) since not all inputs change on every `ngOnChanges` cycle.

## Example

```typescript
@Component({
  selector: 'app-user',
  template: `<p>{{ name }}</p>`
})
export class UserComponent implements OnChanges {
  @Input() name!: string;
  @Input() age!: number;

  ngOnChanges(changes: SimpleChangesTyped<UserComponent>) {
    if (changes.name) {
      // TypeScript knows these are strings
      console.log('Name:', changes.name.previousValue, '→', changes.name.currentValue);
    }

    if (changes.age?.firstChange) {
      // TypeScript knows this is a number
      console.log('Initial age:', changes.age.currentValue);
    }
  }
}
```

## Comparison

```typescript
// ❌ Without SimpleChangesTyped
ngOnChanges(changes: SimpleChanges) {
  if (changes['name']) {
    const prev = changes['name'].previousValue as string; // Manual cast
  }
}

// ✅ With SimpleChangesTyped
ngOnChanges(changes: SimpleChangesTyped<MyComponent>) {
  if (changes.name) {
    const prev = changes.name.previousValue; // Automatically typed as string
  }
}
```

## Use Cases

- **Type-safe change detection**: Access previous/current values without casting
- **Autocomplete support**: IDE provides suggestions for available properties
- **Refactoring safety**: Rename refactoring works correctly across components
- **Better error detection**: Catch typos at compile time

