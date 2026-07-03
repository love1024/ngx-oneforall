import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { notBlank } from 'ngx-oneforall/validators/signals/not-blank';

@Component({
  selector: 'lib-not-blank-signal-form-validatordemo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Enter a name (whitespace-only is invalid):
        <input
          type="text"
          [formField]="testForm.name"
          placeholder="Type something..." />
      </label>

      @if (testForm.name().errors()) {
        <div class="error">
          {{ testForm.name().errors()[0]?.message }}
        </div>
      }

      @if (testForm.name().valid() && testForm.name().value()) {
        <div class="success">Name is valid!</div>
      }
    </div>
  `,
  styleUrl: './not-blank-demo.component.scss',
})
export class NotBlankSignalDemoComponent {
  nameModel = signal({ name: '' });

  testForm = form(this.nameModel, path => {
    notBlank(path.name, { message: 'Oops! This field cannot be left blank.' });
  });
}
