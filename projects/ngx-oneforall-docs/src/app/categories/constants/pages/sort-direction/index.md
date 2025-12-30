The `ngx-oneforall/constants` package provides a constant for sort directions, helping you maintain consistency across your sorting logic.

## Usage

Import the `SORT_DIRECTION` constant to use in your sorting functions or components.

```typescript
import { SORT_DIRECTION } from 'ngx-oneforall/constants';

// Example: Handling sort change
function onSortChange(direction: 'asc' | 'desc') {
  if (direction === SORT_DIRECTION.Asc) {
    // Handle ascending sort
  } else {
    // Handle descending sort
  }
}
```

## SORT_DIRECTION

| Name | Value |
| :--- | :--- |
| **Asc** | `'asc'` |
| **Desc** | `'desc'` |
