

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

### Example 1: Adjusting Layout on Resize

In this example, the `ResizedDirective` is used to detect size changes and adjust the layout dynamically.

```html
<div
  appResized
  (resized)="onResized($event)"
  style="resize: both; overflow: auto; border: 1px solid #ccc; padding: 16px;"
>
  Resize this box to see the dimensions update.
</div>
<p>Width: {{ width }}px</p>
<p>Height: {{ height }}px</p>
```

```typescript
import { Component } from '@angular/core';
import { ResizedEvent } from './resized-event.model';

@Component({
  selector: 'app-resized-demo',
  templateUrl: './resized-demo.component.html',
  styleUrls: ['./resized-demo.component.css']
})
export class ResizedDemoComponent {
  width: number = 0;
  height: number = 0;

  onResized(event: ResizedEvent): void {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }
}
```

### Example 2: Responsive Chart

The `ResizedDirective` can also be used to make charts responsive by redrawing them when their container is resized.

```html
<div appResized (resized)="onChartContainerResized($event)">
  <canvas id="chart"></canvas>
</div>
```

```typescript
import { Component, AfterViewInit } from '@angular/core';
import { ResizedEvent } from './resized-event.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.css']
})
export class ChartDemoComponent implements AfterViewInit {
  private chart: Chart | undefined;

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Sample Data',
            data: [10, 20, 30],
            backgroundColor: ['red', 'blue', 'green']
          }
        ]
      }
    });
  }

  onChartContainerResized(event: ResizedEvent): void {
    if (this.chart) {
      this.chart.resize();
    }
  }
}
```

## API

### Selector

- `[appResized]`: Apply this directive to any HTML element to enable resize detection.

### Outputs

- `resized`: Emits a `ResizedEvent` object whenever the size of the element changes.

### ResizedEvent Model

The `ResizedEvent` object contains the following properties:

- `newWidth`: The new width of the element in pixels.
- `newHeight`: The new height of the element in pixels.

```typescript
export interface ResizedEvent {
  newWidth: number;
  newHeight: number;
}
```

## Conclusion

The `ResizedDirective` is a powerful tool for handling dynamic resizing in Angular applications. By leveraging this directive, you can create responsive and adaptive user interfaces with minimal effort.

Explore this directive in action with a live demonstration:

{{ NgDocActions.demoPane("ResizedDemoComponent") }}