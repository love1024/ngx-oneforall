import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { range, RangeValidator } from '@ngx-oneforall/validators/range';

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RangeValidator],
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

      <div *ngIf="control.errors?.['range'] as error" class="error">
        Value must be between {{ error.min }} and {{ error.max }}. Current:
        {{ error.actualValue }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid value!
      </div>
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

      <div *ngIf="templateCtrl.errors?.['range'] as error" class="error">
        Value must be between {{ error.min }} and {{ error.max }}. Current:
        {{ error.actualValue }}
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid value!
      </div>
    </div>
  `,
  styleUrl: './range-demo.component.scss',
})
export class RangeDemoComponent {
  control = new FormControl(null, range(5, 10));
  templateValue: number | null = null;
}
