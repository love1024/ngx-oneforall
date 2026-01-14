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
      <label for="time">Time (Optional Seconds)</label>
      <input
        id="time"
        type="text"
        [mask]="'00:00:0?0?'"
        placeholder="HH:MM:SS" />
      <span class="hint">Mask: 00:00:0?0?</span>
    </div>

    <div class="demo-section">
      <label for="timeSeconds">Time with Seconds</label>
      <input
        id="timeSeconds"
        type="text"
        [mask]="'00:00:00'"
        placeholder="HH:MM:SS" />
      <span class="hint">Mask: 00:00:00</span>
    </div>

    <div class="demo-section">
      <label for="extension">Phone with Extension</label>
      <input
        id="extension"
        type="text"
        [mask]="'000-000-0000 x0?0?0?0?'"
        placeholder="___-___-____ x____" />
      <span class="hint"
        >Mask: 000-000-0000 x0?0?0?0? — 1-5 digit extension</span
      >
    </div>

    <div class="demo-section">
      <label for="postal">Canadian Postal Code</label>
      <input id="postal" type="text" [mask]="'S0S 0S0'" placeholder="A1A 1A1" />
      <span class="hint">Mask: S0S 0S0</span>
    </div>

    <div class="demo-section">
      <label for="email">Email (*)</label>
      <input
        id="email"
        type="text"
        [mask]="'A*@A*.SSS'"
        placeholder="user@domain.com" />
      <span class="hint"
        >Mask: A*&#64;A*.SSS — alphanumeric username, domain, and TLD</span
      >
    </div>

    <div class="demo-section">
      <label for="hashtag">Hashtag (*)</label>
      <input id="hashtag" type="text" [mask]="'#S*'" placeholder="#tag" />
      <span class="hint">Mask: #S* — any number of letters after #</span>
    </div>
  `,
  styleUrl: 'mask-demo.component.scss',
})
export class MaskDemoComponent {}
