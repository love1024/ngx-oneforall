import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { date, DateValidator } from 'ngx-oneforall/validators/date';

@Component({
  selector: 'app-date-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DateValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter a valid date (e.g. 2023-01-01):
        <input type="text" [formControl]="control" placeholder="YYYY-MM-DD" />
      </label>
    
      @if (control.errors?.['date']; as error) {
        <div class="error">
          Invalid date. Value: {{ error.actualValue }}
        </div>
      }
    
      @if (control.valid && control.value) {
        <div class="success">
          Valid date structure!
        </div>
      }
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
    
      @if (templateCtrl.errors?.['date']; as error) {
        <div class="error">
          Invalid date.
        </div>
      }
    
      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">
          Valid date structure!
        </div>
      }
    </div>
    `,
  styleUrl: './date-demo.component.scss',
})
export class DateDemoComponent {
  control = new FormControl(null, date);
  templateValue: string | null = null;
}
