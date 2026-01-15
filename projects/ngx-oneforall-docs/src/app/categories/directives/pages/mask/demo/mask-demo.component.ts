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
      <div class="info-row">
        <span class="hint">Mask: (###) ###-####</span>
        <span class="model">Value: {{ phoneControl.value }}</span>
      </div>
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
      <div class="info-row">
        <span class="hint">Mask: @#@ #@#</span>
        <span class="model">Value: {{ postalControl.value }}</span>
      </div>
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
      <div class="info-row">
        <span class="hint">Custom X pattern: /[0-9A-Fa-f]/</span>
        <span class="model">Value: {{ hexControl.value }}</span>
      </div>
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
      <div class="info-row">
        <span class="hint">Custom: H=/[0-2]/, M=/[0-5]/</span>
        <span class="model">Value: {{ timeControl.value }}</span>
      </div>
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
      <div class="info-row">
        <span class="hint">Mask: ###-###-#### x#?#?#?#?</span>
        <span class="model">Value: {{ extensionControl.value }}</span>
      </div>
      @if (extensionControl.errors?.['mask']; as error) {
        <span class="error">Incomplete: {{ error.actualValue }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="clearIfNotMatch">Clear If Not Match</label>
      <input
        id="clearIfNotMatch"
        type="text"
        [formControl]="clearIfNotMatchControl"
        [mask]="'(###) ###-####'"
        [clearIfNotMatch]="true"
        placeholder="(___) ___-____" />
      <div class="info-row">
        <span class="hint">Clears on blur if incomplete</span>
        <span class="model">Value: {{ clearIfNotMatchControl.value }}</span>
      </div>
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
  clearIfNotMatchControl = new FormControl('');

  hexPattern: Record<string, IConfigPattern> = {
    X: { pattern: /[0-9A-Fa-f]/ },
  };

  timePatterns: Record<string, IConfigPattern> = {
    H: { pattern: /[0-2]/ },
    M: { pattern: /[0-5]/ },
  };
}
