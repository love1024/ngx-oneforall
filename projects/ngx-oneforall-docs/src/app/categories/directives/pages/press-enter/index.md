Emits an event when the Enter key is pressed on any element.

## Features

- **Enter Key Detection** — Listens for `keydown.enter` event
- **Prevent Default** — Optionally prevents form submission
- **Simple API** — Just add the directive and listen

---

## Installation

```typescript
import { PressEnterDirective } from '@ngx-oneforall/directives/press-enter';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `preventDefault` | `boolean` | `true` | Prevent default Enter behavior |

| Output | Type | Description |
|--------|------|-------------|
| `pressEnter` | `void` | Emits when Enter is pressed |

---

## Basic Usage

```html
<input (pressEnter)="onSubmit()" placeholder="Press Enter" />
```

```typescript
onSubmit() {
  console.log('Enter pressed!');
}
```

---

## Common Use Cases

### Search Input

```html
<input 
  [(ngModel)]="searchQuery"
  (pressEnter)="search()"
  placeholder="Search..." />
```

### Chat Message

```html
<input 
  [(ngModel)]="message"
  (pressEnter)="sendMessage()"
  placeholder="Type a message..." />
```

### Allow Default Behavior

```html
<!-- Don't prevent form submission -->
<input 
  (pressEnter)="onEnter()" 
  [preventDefault]="false" />
```

---

## Live Demo

{{ NgDocActions.demoPane("PressEnterDemoComponent") }}
