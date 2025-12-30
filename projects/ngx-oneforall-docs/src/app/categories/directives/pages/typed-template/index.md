


The `TypedTemplateDirective` provides a way to strictly type the context of your `ng-template` definitions. By default, Angular templates are weakly typed (`any` or `Object`), which can lead to runtime errors when accessing properties that don't exist. This directive bridges that gap, leveraging TypeScript's power directly within your templates.

> **Note**
> This directive is purely for compile-time type checking. It does not affect runtime behavior or inject data into the template. The actual data context must still be provided via `[ngTemplateOutletContext]` or similar mechanisms.

---

### Usage

#### 1. Import the Directive

Import `TypedTemplateDirective` into your component or module.

```typescript
import { TypedTemplateDirective } from 'ngx-oneforall/directives/typed-template';

@Component({
  imports: [TypedTemplateDirective],
  // ...
})
export class MyComponent {}
```

#### 2. Apply to Template

To type a template, start by defining the interface for your context.

```typescript
interface UserContext {
  $implicit: string; // The type for let-name
  age: number;       // The type for let-age="age"
}
```

Then, use a helper property to pass this type to the directive. This property is used purely for type inference.

```typescript
protected get userContextType() {
  return {} as UserContext;
}
```

Finally, bind `[typedTemplate]` to your type helper on the `ng-template`.

```html
<ng-template [typedTemplate]="userContextType" let-name let-age="age">
  <!-- 'name' is strictly typed as string -->
  <!-- 'age' is strictly typed as number -->
  <div>Name: {{ name }}</div>
  <div>Age: {{ age }}</div>
</ng-template>
```

---

### Why use it?

1. **Catch Errors Early**: Typo in a property name? Accessing a missing nested field? TypeScript will catch these errors at build time, preventing runtime crashes.
2. **Better IDE Support**: Enjoy full autocomplete and refactoring capabilities for variables inside your templates, just like in your TypeScript files.
3. **Clear Contracts**: It explicitly documents the data shape expected by the template, making the code easier to understand and maintain for your team.

---

### Live Demo

{{ NgDocActions.demo("TypedTemplateDirectiveDemoComponent") }}

