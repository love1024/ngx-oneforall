This utility is designed to generate unique IDs for components, ensuring no conflicts occur when multiple instances of a component are rendered.

## Overview

The `Unique Component ID` utility is a lightweight function that helps developers generate unique identifiers for Angular components. This is particularly useful for scenarios like:
- Dynamically created components.
- Accessibility attributes (e.g., `aria-labelledby`).
- Associating labels with form controls.
f

## Examples

### Example 1: Generating IDs for Form Elements
```typescript
@Component({
        selector: 'app-form',
        template: `
                <label [attr.for]="inputId">Name</label>
                <input [id]="inputId" type="text" />
        `
})
export class FormComponent {
        inputId: string;

        constructor() {
                this.inputId = uniqueComponentId('form-input');
        }
}
```

### Example 2: Accessibility with ARIA Attributes
```typescript
@Component({
        selector: 'app-dialog',
        template: `
                <div [attr.aria-labelledby]="titleId">
                        <h1 [id]="titleId">Dialog Title</h1>
                </div>
        `
})
export class DialogComponent {
        titleId: string;

        constructor() {
                this.titleId = uniqueComponentId('dialog-title');
        }
}
```

---

## Best Practices

- Always use meaningful prefixes to make debugging easier.
- Avoid hardcoding IDs for dynamically created components.
- Use the utility for accessibility attributes to ensure compliance with standards.

---

## Conclusion

The `Unique Component ID` utility simplifies the process of generating unique identifiers in Angular applications. By integrating this utility, developers can avoid ID conflicts and improve the maintainability of their code.


