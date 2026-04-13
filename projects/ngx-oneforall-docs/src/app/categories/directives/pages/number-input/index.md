![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/number-input&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Formats numerical input using the browser's native `Intl.NumberFormat` with full local support. 

## Features

- **Native Formatting** — Leverages the browser's high-performance `Intl.NumberFormat` engine
- **UX Focused** — Displays localized, formatted strings on `blur` and reveals raw numbers on `focus` for seamless editing
- **Multi-purpose** — Built-in support for Currency, Percentages, Units, and standard Decimals
- **Locale-aware Parsing** — Automatically normalizes local decimal separators (e.g. converting `12,34` in German locales to `12.34` internally)
- **Forms Compatible** — Native support for Reactive and Template-driven Angular forms

---

## Installation

```typescript
import { NumberInputDirective } from 'ngx-oneforall/directives/number-input';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `locale` | `string` | `navigator.language` | BCP 47 language tag (e.g. `en-US`, `de-DE`, `pt-PT`) |
| `options`    | `Intl.NumberFormatOptions` | `undefined`          | Options passed directly to the `Intl.NumberFormat` constructor. For a full list of options, see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat). |
| `min`        | `number`                   | `undefined`          | Minimum allowed numerical value. If `>= 0`, restricts the user from typing a `-` sign. |
| `max`        | `number`                   | `undefined`          | Maximum allowed numerical value. |

### Common Options

The `options` input accepts all `Intl.NumberFormatOptions`. Here are some of the most common configuration blocks:

- **`style`**: The formatting style to use (`decimal`, `currency`, `percent`, or `unit`).
- **`currency`**: The currency to use in currency formatting (e.g., `USD`, `EUR`, `JPY`).
- **`useGrouping`**: Whether to use grouping separators, such as thousands separators (`true` by default).
- **`minimumFractionDigits`**: The minimum number of fraction digits to use (range: `0-20`).
- **`maximumFractionDigits`**: The maximum number of fraction digits to use (range: `0-20`).
- **`notation`**: The formatting that should be used for the number (`standard`, `scientific`, `engineering`, or `compact`).

---

## Range Constraints

You can use `min` and `max` to enforce numerical ranges. When `min` is set to `0` or higher, the directive will automatically prevent the user from typing or pasting negative signs.

### Positive Numbers Only
```html
<input 
  numberInput 
  min="0" 
  [options]="{ minimumFractionDigits: 2 }" />
```

### Age Range (0-120)
```html
<input 
  numberInput 
  min="0" 
  max="120" />
```


---

## Validation Errors

The directive implements the `Validator` interface and returns the following error keys:

| Error Key | Description | Returned Object |
|-----------|-------------|-----------------|
| `invalidNumber` | The input cannot be parsed into a valid number. | `{ invalidNumber: true }` |
| `min` | The value is less than the `min` input. | `{ min: { min: number, actual: number } }` |
| `max` | The value is greater than the `max` input. | `{ max: { max: number, actual: number } }` |

Example usage in templates:
{% raw %}
```html
@if (model.hasError('min')) {
  <div>Value must be at least {{ model.getError('min').min }}!</div>
}
```
{% endraw %}

---

## Basic Usage

The directive is standalone and can be applied directly to a text input.

### Currency Formatting
Displays formatted currency on blur (e.g., "$1,234.56").

```html
<input 
  numberInput 
  locale="en-US" 
  [options]="{ style: 'currency', currency: 'USD' }" />
```

### Percentage Formatting
Displays percentage values (e.g., "85.6%").

```html
<input 
  numberInput 
  [options]="{ style: 'percent', maximumFractionDigits: 1 }" />
```

### Unit Formatting
Displays units supported by `Intl` (e.g., "120 km/h").

```html
<input 
  numberInput 
  locale="pt-PT" 
  [options]="{ style: 'unit', unit: 'kilometer-per-hour', unitDisplay: 'long' }" />
```

### Standard Decimal Formatting
Useful for high-precision or grouped numbers.

```html
<input 
  numberInput 
  [options]="{ minimumFractionDigits: 2, useGrouping: true }" />
```

---

## Forms Integration

The directive keeps your Angular model as a clean `number | null`, regardless of what formatting is displayed visually in the input.

```typescript
@Component({
  template: `<input numberInput [options]="{ style: 'currency', currency: 'USD' }" [formControl]="amount" />`,
  imports: [NumberInputDirective, ReactiveFormsModule]
})
export class PaymentFormComponent {
  amount = new FormControl(1234.56);
}
```

---

## Live Demo

{{ NgDocActions.demoPane("NumberInputDemoComponent") }}
