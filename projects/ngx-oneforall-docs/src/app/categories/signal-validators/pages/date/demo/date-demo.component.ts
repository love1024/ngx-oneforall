import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { date } from 'ngx-oneforall/validators/signals/date';

@Component({
  selector: 'lib-date-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a date string:
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
        <div class="success">Valid date!</div>
      }
    </div>
  `,
  styleUrl: './date-demo.component.scss',
})
export class DateSignalDemoComponent {
  dateModel = signal({ dateStr: '' });

  testForm = form(this.dateModel, path => {
    date(path.dateStr, {
      message: {
        invalid_date: 'The entered date is not valid',
        unsupported_type: 'Unsupported type provided',
      },
    });
  });
}
