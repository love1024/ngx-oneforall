import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { minDate } from 'ngx-oneforall/validators/signals/min-date';

@Component({
  selector: 'lib-min-date-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a date (must be on or after Jan 1, 2025):
        <input
          type="text"
          [formField]="testForm.dateStr"
          placeholder="YYYY-MM-DD" />
      </label>

      @if (testForm.dateStr().errors()) {
        <div class="error">
          {{ testForm.dateStr().errors()[0]?.message }}
        </div>
      }

      @if (testForm.dateStr().valid() && testForm.dateStr().value()) {
        <div class="success">Date is valid!</div>
      }
    </div>
  `,
  styleUrl: './min-date-demo.component.scss',
})
export class MinDateSignalDemoComponent {
  dateModel = signal({ dateStr: '' });

  testForm = form(this.dateModel, path => {
    minDate(path.dateStr, '2025-01-01', {
      message: {
        date_before_min: 'The entered date is before the minimum allowed date of 2025-01-01',
        invalid_date: 'The entered date is not valid',
        unsupported_type: 'Unsupported type provided',
      },
    });
  });
}
