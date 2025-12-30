Restricts user input to valid numeric values with configurable decimal places and negative number support.

## Features

- **Input Validation** — Blocks non-numeric characters on input, paste, and cut
- **Decimal Control** — Configure allowed decimal places
- **Negative Support** — Optionally allow negative numbers
- **Custom Separator** — Use any decimal separator (`.`, `,`, etc.)
- **Forms Compatible** — Works with both native inputs and Angular forms

---

## Installation

```typescript
import { NumbersOnlyDirective } from 'ngx-oneforall/directives/numbers-only';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `decimals` | `number` | `0` | Decimal places allowed (0 = integers only) |
| `negative` | `boolean` | `false` | Allow negative numbers |
| `separator` | `string` | `'.'` | Decimal separator character |

---

## Basic Usage

```html
<!-- Integers only (default) -->
<input numbersOnly />

<!-- Allow 2 decimal places -->
<input numbersOnly [decimals]="2" />

<!-- Allow negative values -->
<input numbersOnly [negative]="true" />

<!-- Custom separator (comma) -->
<input numbersOnly [decimals]="2" [separator]="','" />
```

---

## Common Use Cases

### Currency Input

```html
<input 
  numbersOnly 
  [decimals]="2" 
  placeholder="$0.00" />
```

### Quantity Field

```html
<input 
  numbersOnly 
  [negative]="true" 
  placeholder="Enter quantity" />
```

### Reactive Forms

```typescript
@Component({
  template: `<input numbersOnly [decimals]="2" [formControl]="price" />`,
  imports: [NumbersOnlyDirective, ReactiveFormsModule]
})
export class PriceFormComponent {
  price = new FormControl('');
}
```

---

## Live Demo

{{ NgDocActions.demoPane("NumbersOnlyDemoComponent") }}
