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
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
        margin-bottom: 2rem;
      }
      h3 {
        margin-top: 0;
      }
      input {
        padding: 0.5rem;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
        width: 100%;
        background: var(--ng-doc-input-bg);
        color: var(--ng-doc-text-color);
      }
      .error {
        color: #f44336;
        font-size: 0.9rem;
      }
      .success {
        color: #4caf50;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class RangeLengthDemoComponent {
  control = new FormControl('', rangeLength(5, 10));
  templateValue = '';
}
