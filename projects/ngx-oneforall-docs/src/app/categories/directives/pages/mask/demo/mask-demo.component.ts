import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IConfigPattern, MaskDirective } from 'ngx-oneforall/directives/mask';

@Component({
  selector: 'lib-mask-demo',
  imports: [MaskDirective, ReactiveFormsModule],
  template: `
    <div class="demo-section">
      <label for="phone">Phone Number</label>
      <input
        id="phone"
        type="text"
        [formControl]="phoneControl"
        [mask]="'(###) ###-####'"
        placeholder="(___) ___-____" />
      <span class="hint">Mask: (###) ###-####</span>
      @if (phoneControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="postal">Canadian Postal Code</label>
      <input
        id="postal"
        type="text"
        [formControl]="postalControl"
        [mask]="'@#@ #@#'"
        placeholder="A1A 1A1" />
      <span class="hint">Mask: @#@ #@#</span>
      @if (postalControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="hex">Hex Color (Custom Pattern)</label>
      <input
        id="hex"
        type="text"
        [formControl]="hexControl"
        [mask]="'XXXXXX'"
        [customPatterns]="hexPattern"
        placeholder="FFFFFF" />
      <span class="hint">Custom X pattern: /[0-9A-Fa-f]/</span>
      @if (hexControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="time24">24-Hour Time (Custom)</label>
      <input
        id="time24"
        type="text"
        [formControl]="timeControl"
        [mask]="'H#:M#'"
        [customPatterns]="timePatterns"
        placeholder="23:59" />
      <span class="hint">Custom: H=/[0-2]/, M=/[0-5]/</span>
      @if (timeControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="extension">Phone with Optional Extension</label>
      <input
        id="extension"
        type="text"
        [formControl]="extensionControl"
        [mask]="'###-###-#### x#?#?#?#?'"
        placeholder="___-___-____ x____" />
      <span class="hint">Mask: ###-###-#### x#?#?#?#?</span>
      @if (extensionControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>
  `,
  styleUrl: 'mask-demo.component.scss',
})
export class MaskDemoComponent {
  phoneControl = new FormControl('');
  postalControl = new FormControl('');
  hexControl = new FormControl('');
  timeControl = new FormControl('');
  extensionControl = new FormControl('');

  hexPattern: Record<string, IConfigPattern> = {
    X: { pattern: /[0-9A-Fa-f]/ },
  };

  timePatterns: Record<string, IConfigPattern> = {
    H: { pattern: /[0-2]/ },
    M: { pattern: /[0-5]/ },
  };
}
