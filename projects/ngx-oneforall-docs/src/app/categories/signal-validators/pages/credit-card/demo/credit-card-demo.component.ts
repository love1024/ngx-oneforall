import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { creditCard } from 'ngx-oneforall/validators/signals/credit-card';

@Component({
  selector: 'lib-credit-card-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a credit card number:
        <input
          type="text"
          [formField]="testForm.cc"
          placeholder="Type CC number..." />
      </label>

      @if (testForm.cc().errors()) {
        <div class="error">
          {{ testForm.cc().errors()[0]?.message }}
        </div>
      }

      @if (testForm.cc().valid() && testForm.cc().value()) {
        <div class="success">Valid credit card!</div>
      }
    </div>
  `,
  styleUrl: './credit-card-demo.component.scss',
})
export class CreditCardSignalDemoComponent {
  creditCardModel = signal({ cc: '' });

  testForm = form(this.creditCardModel, path => {
    creditCard(path.cc, {
      message: {
        invalid_length: 'This credit card is too short or too long',
        luhn_failed: 'The credit card number is invalid (Luhn check failed)',
        invalid_amex_prefix: 'American Express cards must start with 34 or 37',
        repeated_digits: 'Credit card cannot contain all repeated digits',
      },
    });
  });
}
