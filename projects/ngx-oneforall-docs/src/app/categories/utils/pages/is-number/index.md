### Utility Functions for Number Validation

In TypeScript and Angular applications, validating data types is essential for maintaining data integrity and avoiding runtime errors. This document introduces three utility functions that help determine whether a value is a number, a numeric string, or a `Number` object. These functions utilize TypeScript's type guard capabilities to ensure type safety and enhance code reliability.

---

## Overview of Utility Functions

### 1. `isNumberValue`

This function determines if a value is a finite number.

#### Key Features:
- Confirms the value is of type `number`.
- Excludes special numeric values like `NaN` and `Infinity`.

#### Example Usage:
```typescript
const value = 42;
if (isNumberValue(value)) {
    console.log(`${value} is a valid number.`);
} else {
    console.log(`${value} is not a valid number.`);
}
```

---

### 2. `isNumberString`

This function checks if a value is a string that represents a valid numeric value.

#### Key Features:
- Ensures the value is a string.
- Validates that the string can be converted to a finite number.
- Filters out invalid numeric strings such as `'NaN'` or `'Infinity'`.

#### Example Usage:
```typescript
const value = '123.45';
if (isNumberString(value)) {
    console.log(`${value} is a valid numeric string.`);
} else {
    console.log(`${value} is not a valid numeric string.`);
}
```

---

### 3. `isNumberObject`

This function verifies if a value is an instance of the `Number` object.

#### Key Features:
- Confirms the value is an object.
- Validates that the object is an instance of the `Number` wrapper class.

#### Example Usage:
```typescript
const value = new Number(42);
if (isNumberObject(value)) {
    console.log(`${value} is a valid Number object.`);
} else {
    console.log(`${value} is not a valid Number object.`);
}
```

---

## Practical Applications in Angular

These utility functions are particularly useful in Angular applications for validating inputs, ensuring type safety, and handling data effectively.

### Example: Validating Form Inputs
```typescript
const inputValue = '123';

if (isNumberString(inputValue)) {
    console.log('The input is a valid numeric string.');
} else {
    console.log('The input is not a valid numeric string.');
}
```

### Example: Type-Safe Operations
```typescript
const value: unknown = 100;

if (isNumberValue(value)) {
    const result = value * 2; // TypeScript infers `value` as a number
    console.log('Result:', result);
}
```

---

## Best Practices

1. **Leverage Type Guards**: These functions utilize TypeScript's type guard feature to enable safer and more predictable code.
2. **Prefer Primitive Types**: While `Number` objects are supported, using primitive `number` types is recommended for simplicity and performance.
3. **Validate External Data**: Always validate user inputs or external data to prevent unexpected behavior or errors.

---

By integrating these utility functions into your TypeScript or Angular projects, you can achieve robust type validation and improve the overall quality of your codebase.
