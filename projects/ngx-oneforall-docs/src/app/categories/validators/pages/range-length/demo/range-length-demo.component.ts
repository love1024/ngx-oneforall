import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  rangeLength,
  RangeLengthValidator,
} from '@ngx-oneforall/validators/range-length';

@Component({
  selector: 'app-range-length-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RangeLengthValidator,
  ],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter text (length 5-10):
        <input [formControl]="control" placeholder="Type here..." />
      </label>

      <div *ngIf="control.errors?.['rangeLength'] as error" class="error">
        Length must be between {{ error.requiredMinLength }} and
        {{ error.requiredMaxLength }}. Current: {{ error.actualLength }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid length!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form (Directive)</h3>
      <label>
        Enter text (length 3-6):
        <input
          [(ngModel)]="templateValue"
          [rangeLength]="[3, 6]"
          #templateCtrl="ngModel"
          placeholder="Type here..." />
      </label>

      <div *ngIf="templateCtrl.errors?.['rangeLength'] as error" class="error">
        Length must be between {{ error.requiredMinLength }} and
        {{ error.requiredMaxLength }}. Current: {{ error.actualLength }}
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid length!
      </div>
    </div>
  `,
  styleUrl: './range-length-demo.component.scss',
})
export class RangeLengthDemoComponent {
  control = new FormControl('', rangeLength(5, 10));
  templateValue = '';
}
