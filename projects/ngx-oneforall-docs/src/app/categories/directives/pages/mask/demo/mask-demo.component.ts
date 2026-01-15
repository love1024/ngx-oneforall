import { Component } from '@angular/core';
import { IConfigPattern, MaskDirective } from 'ngx-oneforall/directives/mask';

@Component({
  selector: 'lib-mask-demo',
  imports: [MaskDirective],
  template: `
    <div class="demo-section">
      <label for="phone">Phone Number</label>
      <input
        id="phone"
        type="text"
        [mask]="'(###) ###-####'"
        placeholder="(___) ___-____" />
      <span class="hint">Mask: (###) ###-####</span>
    </div>

    <div class="demo-section">
      <label for="date">Date</label>
      <input
        id="date"
        type="text"
        [mask]="'##/##/####'"
        placeholder="MM/DD/YYYY" />
      <span class="hint">Mask: ##/##/####</span>
    </div>

    <div class="demo-section">
      <label for="time">Time (Optional Seconds)</label>
      <input
        id="time"
        type="text"
        [mask]="'##:##:#?#?'"
        placeholder="HH:MM:SS" />
      <span class="hint">Mask: ##:##:#?#?</span>
    </div>

    <div class="demo-section">
      <label for="extension">Phone with Extension</label>
      <input
        id="extension"
        type="text"
        [mask]="'###-###-#### x#?#?#?#?'"
        placeholder="___-___-____ x____" />
      <span class="hint">Mask: ###-###-#### x#?#?#?#? — 1-5 digit extension</span>
    </div>

    <div class="demo-section">
      <label for="postal">Canadian Postal Code</label>
      <input id="postal" type="text" [mask]="'@#@ #@#'" placeholder="A1A 1A1" />
      <span class="hint">Mask: @#@ #@#</span>
    </div>

    <div class="demo-section">
      <label for="currency">Currency ($#*)</label>
      <input id="currency" type="text" [mask]="'$#*'" placeholder="$0" />
      <span class="hint">Mask: $#* — any number of digits after $</span>
    </div>

    <div class="demo-section">
      <label for="hex">Hex Color (Custom Pattern)</label>
      <input
        id="hex"
        type="text"
        [mask]="'XXXXXX'"
        [customPatterns]="hexPattern"
        placeholder="FFFFFF" />
      <span class="hint">Custom X pattern: /[0-9A-Fa-f]/</span>
    </div>

    <div class="demo-section">
      <label for="time24">24-Hour Time (Custom Validation)</label>
      <input
        id="time24"
        type="text"
        [mask]="'H#:M#'"
        [customPatterns]="timePatterns"
        placeholder="23:59" />
      <span class="hint">Custom patterns: H=/[0-2]/, M=/[0-5]/</span>
    </div>

    <div class="demo-section">
      <label for="optionalPrefix">Optional First Digit (Custom)</label>
      <input
        id="optionalPrefix"
        type="text"
        [mask]="'O##-####'"
        [customPatterns]="optionalPattern"
        placeholder="123-4567" />
      <span class="hint">Custom O pattern with optional: true</span>
    </div>
  `,
  styleUrl: 'mask-demo.component.scss',
})
export class MaskDemoComponent {
  hexPattern: Record<string, IConfigPattern> = {
    X: { pattern: /[0-9A-Fa-f]/ },
  };

  timePatterns: Record<string, IConfigPattern> = {
    H: { pattern: /[0-2]/ },
    M: { pattern: /[0-5]/ },
  };

  optionalPattern: Record<string, IConfigPattern> = {
    O: { pattern: /\d/, optional: true },
  };
}
