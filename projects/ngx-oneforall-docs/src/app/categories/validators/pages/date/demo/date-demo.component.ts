import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { date, DateValidator } from '@ngx-oneforall/validators/date';

@Component({
  selector: 'app-date-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, DateValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter a valid date (e.g. 2023-01-01):
        <input type="text" [formControl]="control" placeholder="YYYY-MM-DD" />
      </label>

      <div *ngIf="control.errors?.['date'] as error" class="error">
        Invalid date. Value: {{ error.actualValue }}
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid date structure!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form (Directive)</h3>
      <label>
        Enter date string:
        <input
          type="text"
          [(ngModel)]="templateValue"
          date
          #templateCtrl="ngModel"
          placeholder="Type date..." />
      </label>

      <div *ngIf="templateCtrl.errors?.['date'] as error" class="error">
        Invalid date.
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid date structure!
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
export class DateDemoComponent {
  control = new FormControl(null, date);
  templateValue: string | null = null;
}
