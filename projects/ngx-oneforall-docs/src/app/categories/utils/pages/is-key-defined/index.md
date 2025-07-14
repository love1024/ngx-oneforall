In TypeScript and Angular development, verifying the existence and definition of object properties is crucial for writing robust, type-safe code. The `isKeyDefined` utility function provides a reliable way to check whether a specific key exists in an object and is not `undefined`. This function supports both own properties and inherited properties, making it versatile for various use cases.

---

## Function Overview

#### Signature
```typescript
export function isKeyDefined<T extends object>(
    obj: T,
    key: keyof T,
    ownPropertyOnly = true
): boolean
```

#### Description
- Checks if the specified `key` exists in the object `obj` and its value is not `undefined`.
- By default, only the object's own properties are considered. You can include inherited properties by setting `ownPropertyOnly` to `false`.

---

## Key Features

- **Type Safety**: Utilizes TypeScript generics and key constraints for safe property access.
- **Flexible Scope**: Optionally checks inherited properties using the `ownPropertyOnly` parameter.
- **Reliable Validation**: Ensures the property is defined (not `undefined`), preventing common runtime errors.

---

## Example Usage

### Checking Own Properties
```typescript
const user = { name: 'Alice', age: 30 };

if (isKeyDefined(user, 'name')) {
    console.log('The "name" property is defined.');
} else {
    console.log('The "name" property is not defined.');
}
```

### Including Inherited Properties
```typescript
class Person {
    name?: string;
}
class Employee extends Person {
    id?: number;
}

const employee = new Employee();
employee.id = 101;

if (isKeyDefined(employee, 'name', false)) {
    console.log('The "name" property is defined (own or inherited).');
} else {
    console.log('The "name" property is not defined.');
}
```

---

## Practical Applications in Angular

- **Form Validation**: Ensure required fields are present and defined in form models.
- **API Response Handling**: Safely access properties in dynamic or external data objects.
- **Component State Management**: Validate state object keys before performing operations.




