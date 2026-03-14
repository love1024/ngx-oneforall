![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/drag-auto-scroll&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Automatically scrolls a container when a dragged item approaches the top or bottom edge. Apply to any scrollable element used with drag-and-drop.

## Features

- **CDK & Native Compatible** — Listens on `document` so it works with CDK drag-drop and native HTML5 drag
- **Smart Target Auto-Detection** — Automatically finds the nearest scrollable parent element, with a graceful fallback to the `window`
- **Explicit Scroll Target** — Optionally define exactly which element or window should scroll
- **Proportional Speed** — Scrolls faster as the cursor gets closer to the edge
- **Horizontal Bounds** — Only triggers when the cursor is horizontally over the container (with configurable tolerance)
- **Configurable** — Customize margin zone, max speed, and horizontal tolerance
- **Zone Optimized** — Runs outside Angular zone for better performance
- **SSR Safe** — Only activates in the browser
- **Toggleable** — Enable/disable via `dragAutoScrollDisabled` input

> **Note**
> By default, the directive is smart enough to find the scrollable container even if it's placed on a non-scrollable child element. If it fails to find an element with `overflow-y: auto` or `scroll`, it will scroll the `window`.

---

## Installation

```typescript
import { DragAutoScrollDirective } from 'ngx-oneforall/directives/drag-auto-scroll';
```

---

## Basic Usage

```html
<ul dragAutoScroll style="overflow-y: auto; height: 400px">
  @for (item of items; track $index) {
    <li draggable="true">{{ item }}</li>
  }
</ul>
```

---

## API Reference

| Input | Type | Default | Description |
|---|---|---|---|
| `dragAutoScrollMargin` | `number` | `50` | Edge zone height (px) that triggers scrolling |
| `dragAutoScrollSpeed` | `number` | `10` | Maximum scroll speed (px/frame) |
| `dragAutoScrollTolerance` | `number` | `50` | Horizontal tolerance (px) outside container bounds above which scrolling does not trigger |
| `dragAutoScrollDisabled` | `boolean` | `false` | Disables auto-scroll behavior |
| `dragAutoScrollTarget` | `HTMLElement \| Window \| 'window'` | `undefined` | Optional explicit target to scroll instead of auto-detecting |

### `dragAutoScrollTarget`

By default, the directive auto-detects the nearest scrollable parent. Use this input if you want to override the auto-detection and explicitly define the scroll target. It accepts an `HTMLElement`, the global `Window` object, or the string literal `'window'`.

### `dragAutoScrollMargin`

Defines the height (in pixels) of the invisible zone at the top and bottom edges of the container. When the cursor enters this zone during a drag, scrolling begins. Larger values make it easier to trigger scrolling, smaller values require the cursor to be closer to the edge.

### `dragAutoScrollSpeed`

The maximum scroll speed in pixels per animation frame. The actual speed scales proportionally — when the cursor is at the very edge, it scrolls at full speed; at the outer boundary of the margin zone, it scrolls slowly. Increase for long lists where users need to scroll quickly.

### `dragAutoScrollTolerance`

How far (in pixels) the cursor can be **horizontally** outside the container's left/right edges before scrolling stops. This prevents accidental scrolling when the cursor drifts sideways during a drag. Set to `0` to require the cursor to be strictly inside the container horizontally.

### `dragAutoScrollDisabled`

When `true`, the directive stops responding to drag events entirely. Useful for conditionally disabling auto-scroll based on application state.

---

## Custom Configuration

Increase the edge zone and scroll speed for large lists:

```html
<div
  dragAutoScroll
  [dragAutoScrollMargin]="80"
  [dragAutoScrollSpeed]="15"
  style="overflow-y: auto; max-height: 600px"
>
  <!-- draggable content -->
</div>
```

---

## How It Works

1. The directive listens for `dragover` events on `document` (works even when a drag preview covers the container)
2. It checks the cursor is horizontally within the container bounds (± tolerance)
3. When the cursor enters the top or bottom margin zone, scrolling starts via `requestAnimationFrame`
4. Scroll speed scales linearly — the closer to the edge, the faster it scrolls
5. Scrolling stops on `drop`, `dragend`, or when the cursor moves to the center or outside bounds

---

## Live Demo

{{ NgDocActions.demoPane("DragAutoScrollDemoComponent") }}
