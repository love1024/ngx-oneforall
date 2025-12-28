import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { minDate, MinDateDirective } from '@ngx-oneforall/validators/min-date';

@Component({
  selector: 'app-min-date-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MinDateDirective],
  template: `
    <div class="demo-container">
      <h3>Reactive Form (Min: 2023-01-01)</h3>
      <label>
        Enter date >= 2023-01-01:
        <input type="date" [formControl]="control" />
      </label>

      <div *ngIf="control.errors?.['minDate'] as error" class="error">
        Date must be after {{ error.requiredDate | date }}. Actual:
        {{ error.actualValue | date }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid date!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven (Dynamic Min Date)</h3>
      <label>
        Set Minimum Date:
        <input type="date" [(ngModel)]="minDateValue" />
      </label>

      <label>
        Enter Date:
        <input
          type="date"
          [(ngModel)]="templateValue"
          [minDate]="minDateValue"
          #templateCtrl="ngModel" />
      </label>

      <div *ngIf="templateCtrl.errors?.['minDate'] as error" class="error">
        Date must be after {{ error.requiredDate | date }}.
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid date!
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
export class MinDateDemoComponent {
  minVal = new Date('2023-01-01');
  control = new FormControl(null, minDate(this.minVal));

  minDateValue: string | null = '2023-01-01';
  templateValue: string | null = null;
}
