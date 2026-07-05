import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { matchFields } from 'ngx-oneforall/validators/signals/match-field';

@Component({
  selector: 'lib-match-field-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Password:
        <input
          type="password"
          [formField]="testForm.auth.password"
          placeholder="Password" />
      </label>

      <label>
        Confirm Password:
        <input
          type="password"
          [formField]="testForm.auth.confirm"
          placeholder="Confirm Password" />
      </label>

      @if (testForm.auth().errors()) {
        <div class="error">
          {{ testForm.auth().errors()[0]?.message }}
        </div>
      }

      @if (testForm.auth().valid() && testForm.auth.password().value() && testForm.auth.confirm().value()) {
        <div class="success">Passwords match!</div>
      }
    </div>
  `,
  styleUrl: './match-field-demo.component.scss',
})
export class MatchFieldSignalDemoComponent {
  authModel = signal({ auth: { password: '', confirm: '' } });

  testForm = form(this.authModel, path => {
    matchFields(path.auth, 'password', 'confirm', {
      message: 'Passwords do not match',
    });
  });
}
