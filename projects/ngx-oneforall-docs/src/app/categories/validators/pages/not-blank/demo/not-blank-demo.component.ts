import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  notBlank,
  NotBlankValidator,
} from 'ngx-oneforall/validators/not-blank';

@Component({
  selector: 'lib-not-blank-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NotBlankValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter a name (whitespace-only is invalid):
        <input
          type="text"
          [formControl]="control"
          placeholder="Type something..." />
      </label>

      @if (control.errors?.['notBlank']) {
        <div class="error">Value cannot be blank or whitespace-only</div>
      }

      @if (control.valid && control.value) {
        <div class="success">Valid input!</div>
      }
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form</h3>
      <label>
        Enter a description:
        <input
          type="text"
          [(ngModel)]="templateValue"
          notBlank
          #templateCtrl="ngModel"
          placeholder="Type something..." />
      </label>

      @if (templateCtrl.errors?.['notBlank']) {
        <div class="error">Value cannot be blank or whitespace-only</div>
      }

      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">Valid input!</div>
      }
    </div>
  `,
  styleUrl: './not-blank-demo.component.scss',
})
export class NotBlankDemoComponent {
  control = new FormControl(null, [notBlank]);
  templateValue: string | null = null;
}
