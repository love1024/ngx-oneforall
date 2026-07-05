import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { range } from 'ngx-oneforall/validators/signals/range';

@Component({
  selector: 'lib-range-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Age (18-65):
        <input
          type="number"
          [formField]="testForm.age"
          placeholder="Enter age" />
      </label>

      @if (testForm.age().errors()) {
        <div class="error">
          {{ testForm.age().errors()[0]?.message }}
        </div>
      }

      @if (testForm.age().valid() && testForm.age().value()) {
        <div class="success">Valid age!</div>
      }
    </div>
  `,
  styleUrl: './range-demo.component.scss',
})
export class RangeSignalDemoComponent {
  ageModel = signal({ age: '' });

  testForm = form(this.ageModel, path => {
    range(path.age, 18, 65, {
      message: {
        out_of_range: 'Age must be between 18 and 65',
      },
    });
  });
}
