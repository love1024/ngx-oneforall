import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { phone } from 'ngx-oneforall/validators/signals/phone';

@Component({
  selector: 'lib-phone-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        US Phone Number:
        <input
          type="tel"
          [formField]="testForm.phoneNum"
          placeholder="(213) 373-4253" />
      </label>

      @if (testForm.phoneNum().errors()) {
        <div class="error">
          {{ testForm.phoneNum().errors()[0]?.message }}
        </div>
      }

      @if (testForm.phoneNum().valid() && testForm.phoneNum().value()) {
        <div class="success">Valid phone number!</div>
      }
    </div>
  `,
  styleUrl: './phone-demo.component.scss',
})
export class PhoneSignalDemoComponent {
  phoneModel = signal({ phoneNum: '' });

  testForm = form(this.phoneModel, path => {
    phone(path.phoneNum, 'US', {
      message: {
        invalid_format: 'The phone number format is invalid for the US',
      },
    });
  });
}
