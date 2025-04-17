

The `ResizedDirective` is a custom Angular directive designed to detect changes in the size of an HTML element. It provides a simple and efficient way to respond to resizing events, making it particularly useful for building responsive and dynamic user interfaces.

## Overview

The `ResizedDirective` listens for changes in the dimensions of the host element and emits an event containing the new size. This can be used to dynamically adjust layouts, trigger animations, or perform other actions based on the element's size.

## Features

- Detects changes in the width and height of an element.
- Emits an event with the updated dimensions.
- Lightweight and easy to integrate into existing Angular applications.

## Usage

To use the `ResizedDirective`, import it into your Angular module and apply it to the desired HTML element. You can then listen for the `resized` event to handle size changes.

### Importing the Directive

Ensure that the `ResizedDirective` is declared in your Angular module:

```typescript
import { NgModule } from '@angular/core';
import { ResizedDirective } from './resized.directive';

@NgModule({
  declarations: [ResizedDirective],
  exports: [ResizedDirective]
})
export class SharedModule {}
```

### Apply the Directive

In this example, the `ResizedDirective` is used to detect size changes and adjust the layout dynamically.

```html
<div
  appResized
  (resized)="onResized($event)"
  style="resize: both; overflow: auto; border: 1px solid #ccc; padding: 16px;"
>
  Resize this box to see the dimensions update.
</div>
<p>Width: { { width }}px</p>
<p>Height: { { height }}px</p>
```

```typescript
import { Component, signal } from '@angular/core';
import { ResizedEvent } from './resized-event.model';

@Component({
  selector: 'app-resized-demo',
  templateUrl: './resized-demo.component.html',
  styleUrls: ['./resized-demo.component.css']
})
export class ResizedDemoComponent {
  width = signal(0);
  height = signal(0);

  onResized(event: ResizedEvent): void {
    this.width.set(event.newWidth);
    this.height.set(event.newHeight);
  }
}
```


## API

### Selector

- `[resized]`: Apply this directive to any HTML element to enable resize detection.

### Outputs

- `resized`: Emits a `ResizedEvent` object whenever the size of the element changes.

### ResizedEvent Model

The `ResizedEvent` object contains the following properties:

- `current`: A `DOMRectReadOnly` object representing the current dimensions and position of the element.
- `previous`: A `DOMRectReadOnly` object representing the previous dimensions and position of the element, or `null` if no previous size is available.

```typescript
export interface ResizedEvent {
  current: DOMRectReadOnly;
  previous: DOMRectReadOnly | null;
}
```

## Conclusion

The `ResizedDirective` is a powerful tool for handling dynamic resizing in Angular applications. By leveraging this directive, you can create responsive and adaptive user interfaces with minimal effort.

Explore this directive in action with a live demonstration:

{{ NgDocActions.demoPane("ResizedDemoComponent") }}