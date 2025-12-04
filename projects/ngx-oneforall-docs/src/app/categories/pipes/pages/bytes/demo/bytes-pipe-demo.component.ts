import { Component } from '@angular/core';
import { BytesPipe } from '@ngx-oneforall/pipes';

@Component({
  selector: 'app-bytes-pipe-demo',
  standalone: true,
  imports: [BytesPipe],
  template: `
    <div class="demo-container">
      <h3>Basic Usage</h3>
      <p>1024 bytes: <strong>{{ 1024 | bytes }}</strong></p>
      <p>1048576 bytes: <strong>{{ 1048576 | bytes }}</strong></p>
      <p>0 bytes: <strong>{{ 0 | bytes }}</strong></p>

      <h3>Custom Decimals</h3>
      <p>1500 bytes (0 decimals): <strong>{{ 1500 | bytes: 0 }}</strong></p>
      <p>1500 bytes (3 decimals): <strong>{{ 1500 | bytes: 3 }}</strong></p>

      <h3>Custom Units</h3>
      <p>1024 bytes (lowercase): <strong>{{ 1024 | bytes: 2 : ['b', 'kb', 'mb', 'gb', 'tb', 'pb'] }}</strong></p>

      <h3>Large Numbers</h3>
      <p>1073741824 bytes: <strong>{{ 1073741824 | bytes }}</strong></p>
      <p>1099511627776 bytes: <strong>{{ 1099511627776 | bytes }}</strong></p>
    </div>
  `,
  styles: [`
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    h3 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class BytesPipeDemoComponent { }
