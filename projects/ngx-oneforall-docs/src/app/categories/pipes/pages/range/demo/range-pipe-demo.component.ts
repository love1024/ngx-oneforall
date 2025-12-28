import { Component } from '@angular/core';
import { RangePipe } from '@ngx-oneforall/pipes/range';

@Component({
  selector: 'app-range-pipe-demo',
  standalone: true,
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
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      h3 {
        margin-bottom: 0.5rem;
      }
      .range-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .badge {
        background-color: #e0e0e0;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
      }
    `,
  ],
})
export class RangePipeDemoComponent {}
