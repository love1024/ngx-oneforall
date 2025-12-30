Generates unique ID strings for Angular components. Useful for form elements, ARIA attributes, and dynamically created components.

## Usage

```typescript
import { uniqueComponentId } from 'ngx-oneforall/utils/unique-component-id';
```

## API

`uniqueComponentId(prefix?: string): string`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prefix` | `string` | `'id'` | Prefix for the generated ID |

Returns a unique string in the format `{prefix}{counter}`.

```typescript
uniqueComponentId();        // 'id1'
uniqueComponentId();        // 'id2'
uniqueComponentId('btn');   // 'btn1'  (independent counter)
uniqueComponentId('input'); // 'input1' (independent counter)
uniqueComponentId('btn');   // 'btn2'
```

> **Note**
> Each prefix has its own independent counter. `btn1, btn2, input1, input2` instead of a shared global counter.

## Example: Form Label Association

```typescript
@Component({
  selector: 'app-text-input',
  template: `
    <label [attr.for]="inputId">{{ label }}</label>
    <input [id]="inputId" type="text">
  `
})
export class TextInputComponent {
  @Input() label = '';
  inputId = uniqueComponentId('input');
}
```

## Example: ARIA Attributes

```typescript
@Component({
  selector: 'app-dialog',
  template: `
    <div role="dialog" [attr.aria-labelledby]="titleId">
      <h2 [id]="titleId">{{ title }}</h2>
      <ng-content></ng-content>
    </div>
  `
})
export class DialogComponent {
  @Input() title = '';
  titleId = uniqueComponentId('dialog-title');
}
```

## Example: Multiple Instances

```typescript
@Component({
  selector: 'app-accordion-item',
  template: `
    <button [attr.aria-controls]="panelId" (click)="toggle()">
      {{ header }}
    </button>
    <div [id]="panelId" *ngIf="expanded">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionItemComponent {
  @Input() header = '';
  panelId = uniqueComponentId('panel');
  expanded = false;
  
  toggle() { this.expanded = !this.expanded; }
}
```

## Use Cases

- **Form controls**: Associate labels with inputs via `for`/`id` pairing
- **ARIA attributes**: `aria-labelledby`, `aria-describedby`, `aria-controls`
- **Dynamic components**: Ensure unique IDs across multiple instances
- **Accordion/tabs**: Link triggers to their content panels
