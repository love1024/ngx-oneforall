import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { maxDate, MaxDateDirective } from '@ngx-oneforall/validators/max-date';

@Component({
  selector: 'app-max-date-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MaxDateDirective],
  template: `
    <div class="demo-container">
      <h3>Reactive Form (Max: 2025-12-31)</h3>
      <label>
        Enter date <= 2025-12-31:
        <input type="date" [formControl]="control" />
      </label>

      <div *ngIf="control.errors?.['maxDate'] as error" class="error">
        Date must be before {{ error.requiredDate | date }}. Actual:
        {{ error.actualValue | date }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid date!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven (Dynamic Max Date)</h3>
      <label>
        Set Maximum Date:
        <input type="date" [(ngModel)]="maxDateValue" />
      </label>

      <label>
        Enter Date:
        <input
          type="date"
          [(ngModel)]="templateValue"
          [maxDate]="maxDateValue"
          #templateCtrl="ngModel" />
      </label>

      <div *ngIf="templateCtrl.errors?.['maxDate'] as error" class="error">
        Date must be before {{ error.requiredDate | date }}.
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
export class MaxDateDemoComponent {
  maxVal = new Date('2025-12-31');
  control = new FormControl(null, maxDate(this.maxVal));

  maxDateValue: string | null = '2025-12-31';
  templateValue: string | null = null;
}
