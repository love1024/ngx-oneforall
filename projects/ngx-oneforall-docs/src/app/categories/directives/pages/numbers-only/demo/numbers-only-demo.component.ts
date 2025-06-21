import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumbersOnlyDirective } from '@ngx-oneforall/directives';

@Component({
  selector: 'lib-numbers-only-demo',
  imports: [NumbersOnlyDirective, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-block">
        <h3>Positive integers only</h3>
        <input
          numbersOnly
          type="text"
          class="demo-input"
          value="abc"
          [value]="123" />
      </div>

      <div class="demo-block">
        <h3>Positive & negative integers</h3>
        <input
          numbersOnly
          type="text"
          [negative]="true"
          class="demo-input"
          value="-123" />
      </div>

      <div class="demo-block">
        <h3>Positive decimal numbers (2 digits)</h3>
        <input
          numbersOnly
          type="text"
          [decimals]="2"
          class="demo-input"
          value="123.12" />
      </div>

      <div class="demo-block">
        <h3>Positive & negative decimals (2 digits)</h3>
        <input
          numbersOnly
          type="text"
          [decimals]="2"
          [negative]="true"
          class="demo-input"
          value="-123.12" />
      </div>

      <div class="demo-block">
        <h3>Numbers with comma as separator</h3>
        <input
          numbersOnly
          type="text"
          [decimals]="2"
          separator=","
          class="demo-input"
          value="123,12" />
      </div>

      <div class="demo-block">
        <h3>With Angular Forms</h3>
        <input numbersOnly type="text" [(ngModel)]="value" class="demo-input" />
      </div>
    </div>
  `,
  styleUrl: 'numbers-only-demo.component.scss',
})
export class NumbersOnlyDemoComponent {
  value = signal('123');
}
