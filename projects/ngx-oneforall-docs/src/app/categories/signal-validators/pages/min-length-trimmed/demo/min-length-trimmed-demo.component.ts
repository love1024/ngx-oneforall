import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { minLengthTrimmed } from 'ngx-oneforall/validators/signals/min-length-trimmed';

@Component({
  selector: 'lib-min-length-trimmed-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Username (min 3 characters, ignoring spaces):
        <input
          type="text"
          [formField]="testForm.username"
          placeholder="Username" />
      </label>

      @if (testForm.username().errors()) {
        <div class="error">
          {{ testForm.username().errors()[0]?.message }}
        </div>
      }

      @if (testForm.username().valid() && testForm.username().value()) {
        <div class="success">Length requirement met!</div>
      }
    </div>
  `,
  styleUrl: './min-length-trimmed-demo.component.scss',
})
export class MinLengthTrimmedSignalDemoComponent {
  userModel = signal({ username: '' });

  testForm = form(this.userModel, path => {
    minLengthTrimmed(path.username, 3, {
      message: 'Username must be at least 3 characters long',
    });
  });
}
