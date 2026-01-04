import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  minLengthTrimmed,
  MinLengthTrimmedValidator,
} from 'ngx-oneforall/validators/min-length-trimmed';

@Component({
  selector: 'lib-min-length-trimmed-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MinLengthTrimmedValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter at least 3 characters (spaces don't count):
        <input type="text" [formControl]="control" placeholder="Type here..." />
      </label>

      @if (control.errors?.['minLengthTrimmed']; as error) {
        <div class="error">
          Minimum {{ error.requiredLength }} characters required. Current:
          {{ error.actualLength }}
        </div>
      }

      @if (control.valid && control.value) {
        <div class="success">
          Valid! ({{ control.value.trim().length }} characters)
        </div>
      }
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form</h3>
      <label>
        Username (min 3 characters):
        <input
          type="text"
          [(ngModel)]="templateValue"
          [minLengthTrimmed]="3"
          #templateCtrl="ngModel"
          placeholder="Enter username..." />
      </label>

      @if (templateCtrl.errors?.['minLengthTrimmed']; as error) {
        <div class="error">
          Minimum {{ error.requiredLength }} characters required. Current:
          {{ error.actualLength }}
        </div>
      }

      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">Valid username!</div>
      }
    </div>
  `,
  styleUrl: './min-length-trimmed-demo.component.scss',
})
export class MinLengthTrimmedDemoComponent {
  control = new FormControl('', [minLengthTrimmed(3)]);
  templateValue: string | null = null;
}
