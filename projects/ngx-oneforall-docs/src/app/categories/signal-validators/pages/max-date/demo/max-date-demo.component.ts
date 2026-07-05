import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { maxDate } from 'ngx-oneforall/validators/signals/max-date';

@Component({
  selector: 'lib-max-date-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a date (must be on or before Dec 31, 2025):
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
        <div class="success">Date is within range!</div>
      }
    </div>
  `,
  styleUrl: './max-date-demo.component.scss',
})
export class MaxDateSignalDemoComponent {
  dateModel = signal({ dateStr: '' });

  testForm = form(this.dateModel, path => {
    maxDate(path.dateStr, '2025-12-31', {
      message: {
        date_exceeds_max: 'The entered date exceeds the maximum allowed date of 2025-12-31',
        invalid_date: 'The entered date is not valid',
        unsupported_type: 'Unsupported type provided',
      },
    });
  });
}
