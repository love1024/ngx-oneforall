import { Component } from '@angular/core';
import { MaskDirective } from 'ngx-oneforall/directives/mask';

@Component({
  selector: 'lib-mask-demo',
  imports: [MaskDirective],
  template: `
    <div class="demo-section">
      <label for="phone">Phone Number</label>
      <input
        id="phone"
        type="text"
        [mask]="'(000) 000-0000'"
        placeholder="(___) ___-____" />
      <span class="hint">Mask: (000) 000-0000</span>
    </div>

    <div class="demo-section">
      <label for="date">Date</label>
      <input
        id="date"
        type="text"
        [mask]="'00/00/0000'"
        placeholder="MM/DD/YYYY" />
      <span class="hint">Mask: 00/00/0000</span>
    </div>

    <div class="demo-section">
      <label for="postal">Canadian Postal Code</label>
      <input id="postal" type="text" [mask]="'S0S 0S0'" placeholder="___ ___" />
      <span class="hint">Mask: A0A 0A0 (alphanumeric)</span>
    </div>

    <div class="demo-section">
      <label for="optional">Optional Digits</label>
      <input
        id="optional"
        type="text"
        [mask]="'(000) 000-00009'"
        placeholder="Phone with optional extension" />
      <span class="hint">Mask: (000) 000-00009 (last digit optional)</span>
    </div>
  `,
  styleUrl: 'mask-demo.component.scss',
})
export class MaskDemoComponent {}
