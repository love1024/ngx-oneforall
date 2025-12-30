import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { range, RangeValidator } from '@ngx-oneforall/validators/range';

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RangeValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter number (5-10):
        <input
          type="number"
          [formControl]="control"
          placeholder="Type here..." />
      </label>
    
      @if (control.errors?.['range']; as error) {
        <div class="error">
          Value must be between {{ error.min }} and {{ error.max }}. Current:
          {{ error.actualValue }}
        </div>
      }
    
      @if (control.valid && control.value) {
        <div class="success">
          Valid value!
        </div>
      }
    </div>
    
    <div class="demo-container">
      <h3>Template-Driven Form (Directive)</h3>
      <label>
        Enter number (10-20):
        <input
          type="number"
          [(ngModel)]="templateValue"
          [range]="[10, 20]"
          #templateCtrl="ngModel"
          placeholder="Type here..." />
      </label>
    
      @if (templateCtrl.errors?.['range']; as error) {
        <div class="error">
          Value must be between {{ error.min }} and {{ error.max }}. Current:
          {{ error.actualValue }}
        </div>
      }
    
      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">
          Valid value!
        </div>
      }
    </div>
    `,
  styleUrl: './range-demo.component.scss',
})
export class RangeDemoComponent {
  control = new FormControl(null, range(5, 10));
  templateValue: number | null = null;
}
