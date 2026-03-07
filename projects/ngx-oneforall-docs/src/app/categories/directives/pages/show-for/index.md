![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/show-for&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

A structural directive that shows an element for a specified duration, then removes it from the DOM.

## Features

- **Timer-based** — Shows element for a given duration, then removes it
- **Then template** — Optionally swap to a different template after expiry
- **Reactive** — Resets timer when duration input changes
- **Clean** — Automatically clears timer on destroy

---

## Installation

```typescript
import { ShowForDirective } from 'ngx-oneforall/directives/show-for';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `showFor` | `number` | — | Duration in ms to show the element |
| `showForThen` | `TemplateRef` | `undefined` | Template to render after expiry |

| Output | Type | Description |
|--------|------|-------------|
| `showForOnExpired` | `void` | Emits when the timer expires |

---

## Basic Usage

```html
<div *showFor="5000">
  This disappears after 5 seconds
</div>
```

---

## Swap Template on Expiry

```html
<div *showFor="3000; then expiredTpl">
  🔥 Limited time offer!
</div>

<ng-template #expiredTpl>
  <div>Offer expired. Come back tomorrow!</div>
</ng-template>
```

---

## Listen for Expiry

```html
<ng-template [showFor]="2000" (showForOnExpired)="onBannerExpired()">
  <div>Welcome to our site!</div>
</ng-template>
```

```typescript
onBannerExpired() {
  console.log('Banner dismissed');
}
```

---

## Common Use Cases

### Flash Message

```html
<div *showFor="4000" class="flash-success">
  ✅ Saved successfully!
</div>
```

### Intro Banner with CTA Swap

```html
<div *showFor="5000; then ctaTpl" class="intro-banner">
  👋 Welcome! Here's a quick tip...
</div>

<ng-template #ctaTpl>
  <button>Get Started</button>
</ng-template>
```

### Temporary Discount Badge

```html
<span *showFor="10000" class="badge">NEW</span>
```

---

## Live Demo

{{ NgDocActions.demoPane("ShowForDemoComponent") }}
