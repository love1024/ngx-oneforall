import { Component } from '@angular/core';
import { TruncatePipe } from '@ngx-oneforall/pipes/truncate';

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
        <h3>End Truncation (default)</h3>
        <code>longText | truncate:30</code>
        <div class="result">
          {{ longText | truncate: 30 }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Start Truncation</h3>
        <code>longText | truncate:30:false:'…':'start'</code>
        <div class="result">
          {{ longText | truncate: 30 : false : '…' : 'start' }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Middle Truncation</h3>
        <code>longText | truncate:30:false:'…':'middle'</code>
        <div class="result">
          {{ longText | truncate: 30 : false : '…' : 'middle' }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Complete Words (end only)</h3>
        <code>longText | truncate:30:true</code>
        <div class="result">
          {{ longText | truncate: 30 : true }}
        </div>
      </div>

      <div class="demo-section">
        <h3>Custom Ellipsis</h3>
        <code>longText | truncate:30:true:'...'</code>
        <div class="result">
          {{ longText | truncate: 30 : true : '...' }}
        </div>
      </div>
    </div>
  `,
  styleUrl: 'truncate-pipe-demo.component.scss',
})
export class TruncatePipeDemoComponent {
  longText =
    'The Angular truncate pipe shortens a string to a specified length, optionally preserving whole words and adding an ellipsis or custom ending.';
}
