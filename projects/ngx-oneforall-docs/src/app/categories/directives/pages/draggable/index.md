![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/draggable&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Makes any element draggable with mouse and touch support. Perfect for movable popups, modals, and floating panels.

## Features

- **Mouse & Touch** — Works seamlessly with both input methods
- **Drag Handle** — Separate drag handle from the moved element
- **Boundary Constraints** — Limit dragging to viewport, parent, or custom element
- **Zone Optimized** — Runs outside Angular zone for better performance
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { DraggableDirective, DraggableDragEvent } from 'ngx-oneforall/directives/draggable';
```

---

## Basic Usage

Make any element draggable:

```html
<div makeDraggable style="position: absolute;">
  Drag me around!
</div>
```

---

## API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `makeDraggableEnabled` | `boolean` | `true` | Enables/disables dragging |
| `makeDraggableTarget` | `HTMLElement \| null` | `null` | Element to move (defaults to host element) |
| `makeDraggableBoundary` | `'viewport' \| 'parent' \| HTMLElement \| null` | `null` | Constrains dragging within bounds |
| `makeDraggableThreshold` | `number` | `5` | Minimum distance (px) before drag starts |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `dragStart` | `DraggableDragEvent` | Emits when dragging begins |
| `dragMove` | `DraggableDragEvent` | Emits continuously while dragging |
| `dragEnd` | `DraggableDragEvent` | Emits when dragging ends |

### DraggableDragEvent Interface

```typescript
interface DraggableDragEvent {
  x: number;         // Current X position relative to viewport
  y: number;         // Current Y position relative to viewport
  deltaX: number;    // Change in X since last event
  deltaY: number;    // Change in Y since last event
  originalEvent: MouseEvent | TouchEvent;
}
```

---

## Modal with Drag Handle

The most common use case — drag a modal by its header:

```typescript
@Component({
  template: `
    <div class="modal" #modal>
      <div class="modal-header" makeDraggable [makeDraggableTarget]="modal">
        <span>Settings</span>
        <button (click)="close()">×</button>
      </div>
      <div class="modal-body">
        Modal content here...
      </div>
    </div>
  `,
  imports: [DraggableDirective]
})
export class ModalComponent {}
```

---

## Boundary Constraints

### Constrain to Viewport

```html
<div makeDraggable [makeDraggableBoundary]="'viewport'">
  Can't leave the screen!
</div>
```

### Constrain to Parent

```html
<div class="container">
  <div makeDraggable [makeDraggableBoundary]="'parent'">
    Stays within container
  </div>
</div>
```

### Constrain to Custom Element

```html
<div #bounds class="bounds">
  <div makeDraggable [makeDraggableBoundary]="bounds">
    Stays within bounds
  </div>
</div>
```

---

## Event Handling

Track drag position and state:

```typescript
@Component({
  template: `
    <div makeDraggable
         (dragStart)="onDragStart($event)"
         (dragMove)="onDragMove($event)"
         (dragEnd)="onDragEnd($event)">
      Drag me!
    </div>
    <p>Position: ({{"{{ position.x }}"}}, {{"{{ position.y }}"}})</p>
    <p>Status: {{"{{ isDragging ? 'Dragging...' : 'Idle' }}"}}</p>
  `,
  imports: [DraggableDirective]
})
export class TrackingComponent {
  position = { x: 0, y: 0 };
  isDragging = false;

  onDragStart(event: DraggableDragEvent) {
    this.isDragging = true;
  }

  onDragMove(event: DraggableDragEvent) {
    this.position = { x: event.x, y: event.y };
  }

  onDragEnd(event: DraggableDragEvent) {
    this.isDragging = false;
  }
}
```

---

## Multiple Draggable Popups

Each popup maintains its own position independently:

```typescript
@Component({
  template: `
    @for (popup of popups; track popup.id) {
      <div class="popup"
           style="position: absolute;"
           makeDraggable
           [makeDraggableBoundary]="'viewport'">
        <div class="popup-header">{{"{{ popup.title }}"}}</div>
        <div class="popup-content">{{"{{ popup.content }}"}}</div>
      </div>
    }
  `,
  imports: [DraggableDirective]
})
export class MultiPopupComponent {
  popups = [
    { id: 1, title: 'Popup 1', content: 'Content...' },
    { id: 2, title: 'Popup 2', content: 'Content...' },
  ];
}
```

---

## Conditionally Enable

```html
<div makeDraggable
     [makeDraggableEnabled]="isEditMode"
     (dragEnd)="savePosition($event)">
  {{"{{ isEditMode ? 'Drag to reposition' : 'Click edit to move' }}"}}
</div>
```

---

## Live Demo

{{ NgDocActions.demoPane("DraggableDemoComponent") }}
