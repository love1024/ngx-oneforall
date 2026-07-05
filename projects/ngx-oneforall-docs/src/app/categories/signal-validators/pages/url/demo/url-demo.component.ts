import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { url } from 'ngx-oneforall/validators/signals/url';

@Component({
  selector: 'lib-url-signal-form-validator-demo',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="demo-container">
      <h3>Signal Form</h3>
      <label>
        Website URL (http/https):
        <input
          type="url"
          [formField]="testForm.website"
          placeholder="https://example.com" />
      </label>

      @if (testForm.website().errors()) {
        <div class="error">
          {{ testForm.website().errors()[0]?.message }}
        </div>
      }

      @if (testForm.website().valid() && testForm.website().value()) {
        <div class="success">Valid URL!</div>
      }
    </div>
  `,
  styleUrl: './url-demo.component.scss',
})
export class UrlSignalDemoComponent {
  urlModel = signal({ website: '' });

  testForm = form(this.urlModel, path => {
    url(path.website, {
      protocols: ['http', 'https'],
      message: {
        invalid_format: 'Please enter a valid URL',
        invalid_protocol: 'Only HTTP and HTTPS are allowed',
      },
    });
  });
}
