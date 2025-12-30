import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  url,
  UrlValidator,
  UrlValidatorOptions,
} from 'ngx-oneforall/validators/url';

@Component({
  selector: 'app-url-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, UrlValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form (Strict Absolute)</h3>
      <label>
        Enter absolute URL (e.g. https://google.com):
        <input type="text" [formControl]="control" placeholder="https://..." />
      </label>
    
      @if (control.errors?.['url']; as error) {
        <div class="error">
          Invalid URL. Actual: {{ error.actualValue }}
        </div>
      }
    
      @if (control.valid && control.value) {
        <div class="success">
          Valid URL!
        </div>
      }
    </div>
    
    <div class="demo-container">
      <h3>Template-Driven (Protocol Optional)</h3>
      <label>
        Enter URL (e.g. google.com or https://google.com):
        <input
          type="text"
          [(ngModel)]="templateValue"
          [url]="options"
          #templateCtrl="ngModel"
          placeholder="google.com" />
      </label>
    
      @if (templateCtrl.errors?.['url']; as error) {
        <div class="error">
          Invalid URL.
        </div>
      }
    
      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">
          Valid URL!
        </div>
      }
    </div>
    `,
  styleUrl: './url-demo.component.scss',
})
export class UrlDemoComponent {
  control = new FormControl(null, url());
  templateValue: string | null = null;
  options: UrlValidatorOptions = { skipProtocol: true };
}
