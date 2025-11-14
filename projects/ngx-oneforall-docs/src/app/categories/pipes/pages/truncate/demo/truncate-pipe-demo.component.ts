import { Component } from '@angular/core';
import { TruncatePipe } from '@ngx-oneforall/pipes';

@Component({
  selector: 'lib-truncate-pipe-demo',
  imports: [TruncatePipe],
  template: `
    <div class="demo-container">
      <h2>Truncate Pipe Demo</h2>
      <p>
        <strong>Original text:</strong>
        <span class="original">{{ longText }}</span>
      </p>

      <div class="demo-section">
        <h3>Default Usage</h3>
        <p>
          <code>{{ longText }} | truncate</code>
        </p>
        <div class="result">
          {{ longText | truncate }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Custom Limit (30 characters)</h3>
        <p>
          <code>{{ longText }} | truncate:30</code>
        </p>
        <div class="result">
          {{ longText | truncate: 30 }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Complete Words (limit: 30)</h3>
        <p>
          <code>{{ longText }} | truncate:30:true</code>
        </p>
        <div class="result">
          {{ longText | truncate: 30 : true }}
        </div>
      </div>

      <div class="demo-section">
        <h3>
          Custom Ellipsis (limit: 30, completeWords: true, ellipsis: '...')
        </h3>
        <p>
          <code>{{ longText }} | truncate:30:true:'...'</code>
        </p>
        <div class="result">
          {{ longText | truncate: 30 : true : '...' }}
        </div>
      </div>
    </div>
  `,
  styleUrl: 'truncate-pipe-demo.component.scss',
  standalone: true,
})
export class TruncatePipeDemoComponent {
  longText =
    'The Angular truncate pipe shortens a string to a specified length, optionally preserving whole words and adding an ellipsis or custom ending.';
}
