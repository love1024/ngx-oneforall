


The `NumbersOnlyDirective` is a powerful Angular directive designed to restrict user input in form fields to valid numeric values. It provides a flexible and configurable way to enforce numeric-only input, supporting a variety of use cases such as integers, decimals, negative numbers, and custom decimal separators.

### Features

- **Integer-only input:** Restrict input to whole numbers.
- **Decimal support:** Allow numbers with a configurable number of decimal places.
- **Negative numbers:** Optionally permit negative values.
- **Custom decimal separator:** Support for different decimal separators (e.g., `.` or `,

- **Works with or without Angular forms:** Compatible with both standalone inputs and those bound to `NgModel` or reactive forms.

`).

### Directive Inputs

| Input      | Type      | Default | Description                                              |
|------------|-----------|---------|----------------------------------------------------------|
| `decimals` | `number`  | `0`     | Number of decimal places allowed. `0` means integers only.|
| `negative` | `boolean` | `false` | Allow negative numbers if set to `true`.                 |
| `separator`| `string`  | `.`     | Character used as the decimal separator.                 |

### Usage Examples

#### 1. Integer Only

```html
<input type="text" numbersOnly />
```
*Allows only positive integers (e.g., `123`).*

#### 2. Integer with Negative Values

```html
<input type="text" numbersOnly [negative]="true" />
```
*Allows positive and negative integers (e.g., `-42`, `17`).*

#### 3. Decimal Numbers

```html
<input type="text" numbersOnly [decimals]="2" />
```
*Allows numbers with up to 2 decimal places (e.g., `12.34`).*

#### 4. Decimal with Negative Values

```html
<input type="text" numbersOnly [decimals]="3" [negative]="true" />
```
*Allows negative and positive numbers with up to 3 decimal places (e.g., `-5.123`).*

#### 5. Custom Decimal Separator

```html
<input type="text" numbersOnly [decimals]="2" [separator]="','" />
```
*Allows numbers with a comma as the decimal separator (e.g., `123,45`).*

### Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("NumbersOnlyDemoComponent") }}

### Best Practices

- Use with Angular forms (`NgModel` or reactive forms) for seamless integration.
- Combine with form validation for enhanced user experience.
- Clearly indicate to users the expected input format, especially when using custom separators.


