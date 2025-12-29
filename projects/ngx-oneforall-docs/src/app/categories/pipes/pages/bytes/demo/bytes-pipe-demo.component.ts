import { Component } from '@angular/core';
import { BytesPipe } from '@ngx-oneforall/pipes/bytes';

@Component({
  selector: 'app-bytes-pipe-demo',
  imports: [BytesPipe],
  template: `
    <div class="demo-container">
      <h3>Basic Usage (Binary - 1024)</h3>
      <p>
        1024 bytes: <strong>{{ 1024 | bytes }}</strong>
      </p>
      <p>
        1048576 bytes: <strong>{{ 1048576 | bytes }}</strong>
      </p>
      <p>
        0 bytes: <strong>{{ 0 | bytes }}</strong>
      </p>

      <h3>SI Units (Base 1000)</h3>
      <p>
        1000 bytes (SI): <strong>{{ 1000 | bytes: 2 : null : true }}</strong>
      </p>
      <p>
        1000000 bytes (SI):
        <strong>{{ 1000000 | bytes: 2 : null : true }}</strong>
      </p>
      <p>
        1024 bytes (Binary):
        <strong>{{ 1024 | bytes: 2 : null : false }}</strong>
      </p>

      <h3>Custom Decimals</h3>
      <p>
        1500 bytes (0 decimals): <strong>{{ 1500 | bytes: 0 }}</strong>
      </p>
      <p>
        1500 bytes (3 decimals): <strong>{{ 1500 | bytes: 3 }}</strong>
      </p>

      <h3>Custom Units</h3>
      <p>
        1024 bytes (lowercase):
        <strong>{{
          1024 | bytes: 2 : ['b', 'kb', 'mb', 'gb', 'tb', 'pb']
        }}</strong>
      </p>

      <h3>Large Numbers</h3>
      <p>
        1 GB: <strong>{{ 1073741824 | bytes }}</strong>
      </p>
      <p>
        1 TB: <strong>{{ 1099511627776 | bytes }}</strong>
      </p>
    </div>
  `,
  styleUrl: './bytes-pipe-demo.component.scss',
})
export class BytesPipeDemoComponent {}
