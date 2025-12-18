The `@ngx-oneforall/constants` package provides a set of common regular expressions for data validation. These constants help you maintain consistency and avoid duplicate regex definitions across your application.

## Usage

Import the `REGEX` constant to use in your validators or logic.

```typescript
import { REGEX } from '@ngx-oneforall/constants';

// Example: Using regex for manual validation
const value = '12345';
const isNumeric = REGEX.Numeric.test(value);

// Example: Using in an Angular FormControl validator (Pattern validator)
const control = new FormControl('', [Validators.pattern(REGEX.AlphaNumeric)]);
```

## REGEX

### Numeric

| Name | Regex | Description |
| :--- | :--- | :--- |
| **Numeric** | `/^\d+$/` | Matches one or more digits. |
| **Integer** | `/^-?\d+$/` | Matches positive or negative integers. |
| **Decimal** | `/^-?\d+(\.\d+)?$/` | Matches positive or negative decimal numbers. |
| **PositiveInteger** | `/^\d+$/` | Matches positive integers. |
| **NegativeInteger** | `/^-\d+$/` | Matches negative integers. |

### Alphabetic

| Name | Regex | Description |
| :--- | :--- | :--- |
| **Alpha** | `/^[a-zA-Z]+$/` | Matches alphabetic characters (case-insensitive). |
| **AlphaLower** | `/^[a-z]+$/` | Matches lowercase alphabetic characters. |
| **AlphaUpper** | `/^[A-Z]+$/` | Matches uppercase alphabetic characters. |
| **AlphaNumeric** | `/^[a-zA-Z0-9]+$/` | Matches alphabetic and numeric characters. |
