import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { number, NumberValidator } from '@ngx-oneforall/validators/number';

@Component({
  selector: 'app-number-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NumberValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter any number (no strings like "abc"):
        <input type="text" [formControl]="control" placeholder="Type here..." />
      </label>

      <div *ngIf="control.errors?.['number'] as error" class="error">
        Value must be a valid number. Current: {{ error.actualValue }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid number!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form (Directive)</h3>
      <label>
        Enter any number:
        <input
          type="text"
          [(ngModel)]="templateValue"
          number
          #templateCtrl="ngModel"
          placeholder="Type here..." />
      </label>

      <div *ngIf="templateCtrl.errors?.['number'] as error" class="error">
        Value must be a valid number. Current: {{ error.actualValue }}
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid number!
      </div>
    </div>
  `,
  styleUrl: './number-demo.component.scss',
})
export class NumberDemoComponent {
  control = new FormControl(null, number);
  templateValue: string | null = null;
}
