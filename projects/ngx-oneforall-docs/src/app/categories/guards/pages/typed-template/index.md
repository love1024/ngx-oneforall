


The `TypedTemplateDirective` enables strict type safety for Angular templates, allowing you to define and enforce the shape of the context passed to an `ng-template`. This approach improves maintainability and reduces runtime errors by leveraging TypeScript's type system directly within your templates.

---

### Overview

With the `TypedTemplateDirective`, you can bind a type to an `ng-template` context, ensuring that only the specified properties are accessible inside the template. This is especially useful for complex UI components, reusable templates, and scenarios where context shape consistency is critical.

---

### How to Use

#### 1. Import the Directive

First, import the directive into your component:

```typescript
import { TypedTemplateDirective } from '@ngx-oneforall/guards/typed-template';
```

#### 2. Define a Typed Context

Create an interface representing the context you want to pass to your template:

```typescript
interface User {
  id: number;
  fullName: string;
  years: number;
}
```

#### 3. Define a property in your TS
This is just a getter which returns an empty object typecased to the required context type.

```typescript
get userType() {
  return {} as User;
}
```

#### 4. Apply the Directive in Your Template

Use the directive on an `ng-template`, binding the desired type. The context provided to the template will be strictly typed:

```html
<ng-template
  #userTemplate
  let-fullName="fullName"
  let-years="years"
  [typedTemplate]="userType">
  <div class="user-card">
    <span class="label">Full Name:</span>
    <span class="value">{{ fullName }}</span>
    <br />
    <span class="label">Age:</span>
    <span class="value">{{ years }}</span>
  </div>
</ng-template>
```

---

### Benefits

- **Type Safety:** Only properties defined in your interface are accessible within the template.
- **Clarity:** Template context is explicit, reducing ambiguity and improving code readability.
- **Maintainability:** Changes to context shape are enforced by TypeScript, minimizing runtime errors.

---

### Example Use Cases

- Rendering user profiles, cards, or lists with a consistent context shape.
- Building reusable templates for dashboards, tables, or detail views.
- Enforcing context contracts in shared or library components.

---

### Live Demo

{{ NgDocActions.demo("TypedTemplateGuardDemoComponent") }}

---

### Customization

You can define any interface for your context, and the directive will enforce its shape within the template. This flexibility allows you to tailor templates for a wide range of scenarios while maintaining strict type contracts.

---

