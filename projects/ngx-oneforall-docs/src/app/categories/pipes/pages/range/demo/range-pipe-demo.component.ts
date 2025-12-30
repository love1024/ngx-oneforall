import { Component } from '@angular/core';
import { RangePipe } from 'ngx-oneforall/pipes/range';

@Component({
  selector: 'app-range-pipe-demo',
  imports: [RangePipe],
  template: `
    <div class="demo-container">
      <h3>Basic Usage (0 to 5)</h3>
      <div class="range-list">
        @for (i of 5 | range; track i) {
          <span class="badge">{{ i }}</span>
        }
      </div>

      <h3>Start and End (1 to 5)</h3>
      <div class="range-list">
        @for (i of 1 | range: 5; track i) {
          <span class="badge">{{ i }}</span>
        }
      </div>

      <h3>With Step (0 to 10, step 2)</h3>
      <div class="range-list">
        @for (i of 0 | range: 10 : 2; track i) {
          <span class="badge">{{ i }}</span>
        }
      </div>

      <h3>Decreasing (5 to 1)</h3>
      <div class="range-list">
        @for (i of 5 | range: 1; track i) {
          <span class="badge">{{ i }}</span>
        }
      </div>
    </div>
  `,
  styleUrl: './range-pipe-demo.component.scss',
})
export class RangePipeDemoComponent {}
