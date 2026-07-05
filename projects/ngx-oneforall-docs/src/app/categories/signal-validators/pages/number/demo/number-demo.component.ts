import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { number } from 'ngx-oneforall/validators/signals/number';

@Component({
  selector: 'lib-number-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a number:
        <input
          type="text"
          [formField]="testForm.num"
          placeholder="e.g. 123" />
      </label>

      @if (testForm.num().errors()) {
        <div class="error">
          {{ testForm.num().errors()[0]?.message }}
        </div>
      }

      @if (testForm.num().valid() && testForm.num().value()) {
        <div class="success">Valid number!</div>
      }
    </div>
  `,
  styleUrl: './number-demo.component.scss',
})
export class NumberSignalDemoComponent {
  numModel = signal({ num: '' });

  testForm = form(this.numModel, path => {
    number(path.num, {
      message: 'Please enter a valid number',
    });
  });
}
