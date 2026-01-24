![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/datetime&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Apply date/time format masks to input fields, ensuring valid date and time values.

## Features

- **Format patterns** — Use familiar patterns like `MM-DD-YYYY`, `HH:mm:ss`
- **Smart validation** — Validates as you type (e.g., rejects 13 for month)
- **Date validation** — Validates complete dates (e.g., rejects Feb 30)
- **Auto-insert separators** — Automatically adds separators like `-`, `/`, `:`
- **Form validation** — Implements Angular's `Validator` interface
- **Min/Max dates** — Optional date range constraints

---

## Installation

```typescript
import { DateTimeDirective } from 'ngx-oneforall/directives/datetime';
```

---

## Basic Usage

```html
<!-- Date input -->
<input [dateTime]="'MM-DD-YYYY HH:mm'" />
```

---

## Format Patterns

| Pattern | Description | Valid Range |
|---------|-------------|-------------|
| `YYYY` | 4-digit year | 0001-9999 |
| `YY` | 2-digit year | 00-99 |
| `MM` | 2-digit month | 01-12 |
| `M` | 1-2 digit month | 1-12 |
| `DD` | 2-digit day | 01-31 |
| `D` | 1-2 digit day | 1-31 |
| `HH` | 24-hour format | 00-23 |
| `hh` | 12-hour format | 01-12 |
| `mm` | Minutes | 00-59 |
| `ss` | Seconds | 00-59 |
| `A` | AM/PM (uppercase) | AM, PM |
| `a` | am/pm (lowercase) | am, pm |

---

## API Reference

| Input | Type | Description |
|-------|------|-------------|
| `dateTime` | `string` | The format pattern (required) |
| `min` | `Date` | Minimum allowed date |
| `max` | `Date` | Maximum allowed date |
| `clearIfNotMatch` | `boolean` | Clear on blur if incomplete (default: `false`) |
| `removeSpecialCharacters` | `boolean` | Remove separators from form value (default: `true`) |
| `dateTimeChanged` | `output<DateTimeParts>` | Emits parsed date/time parts (day, month, year, etc.) |

---

## Validation

The directive validates:
1. **Format compliance** — Input matches the specified pattern
2. **Date validity** — The date actually exists (e.g., Feb 30 is rejected)
3. **Range constraints** — Date is within min/max if specified

```typescript
// Error object structure
{
  dateTime: {
    requiredFormat: 'MM-DD-YYYY',
    actualLength: 5,
    expectedLength: 10
  }
}

// For invalid dates
{
  dateTime: {
    message: 'Invalid date: 2/30/2024 does not exist',
    invalidDate: true
  }
}
```

---

## Reactive Forms Example

```typescript
@Component({
  template: '<input [dateTime]="format" [formControl]="dateControl" />'
})
export class MyComponent {
  format = 'MM-DD-YYYY';
  dateControl = new FormControl('');
}
```

---

## Output Event

The `dateTimeChanged` output emits a object with decomposed date parts.

```html
<input [dateTime]="'MM-DD-YYYY hh:mm:ss A'" (dateTimeChanged)="onDateTimeChanged($event)" />
```

```typescript
onDateTimeChanged(parts: DateTimeParts) {
  console.log(parts);
  // { day: "01", month: "12", year: "2024", hour: "12", minute: "30", second: "45", dayPeriod: "PM" }
}
```

---

## Demo

{{ NgDocActions.demoPane("DateTimeDemoComponent") }}
