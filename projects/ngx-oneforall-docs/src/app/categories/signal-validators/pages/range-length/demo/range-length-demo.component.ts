import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { rangeLength } from 'ngx-oneforall/validators/signals/range-length';

@Component({
  selector: 'lib-range-length-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Username (3-10 characters):
        <input
          type="text"
          [formField]="testForm.username"
          placeholder="Enter username" />
      </label>

      @if (testForm.username().errors()) {
        <div class="error">
          {{ testForm.username().errors()[0]?.message }}
        </div>
      }

      @if (testForm.username().valid() && testForm.username().value()) {
        <div class="success">Valid username length!</div>
      }
    </div>
  `,
  styleUrl: './range-length-demo.component.scss',
})
export class RangeLengthSignalDemoComponent {
  userModel = signal({ username: '' });

  testForm = form(this.userModel, path => {
    rangeLength(path.username, 3, 10, {
      message: {
        length_out_of_range: 'Username must be between 3 and 10 characters long',
      },
    });
  });
}
