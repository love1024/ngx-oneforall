import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  creditCard,
  CreditCardValidator,
} from '@ngx-oneforall/validators/credit-card';

@Component({
  selector: 'app-credit-card-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CreditCardValidator,
  ],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter Credit Card Number:
        <input
          type="text"
          [formControl]="control"
          placeholder="0000 0000 0000 0000" />
      </label>

      <div *ngIf="control.errors?.['creditCard']" class="error">
        Invalid credit card number (Luhn check failed or invalid length).
      </div>

      <div *ngIf="control.valid && control.value" class="success">
        Valid credit card number!
      </div>
    </div>

    <div class="demo-container">
      <h3>Template-Driven Form (Directive)</h3>
      <label>
        Enter Credit Card Number:
        <input
          type="text"
          [(ngModel)]="templateValue"
          creditCard
          #templateCtrl="ngModel"
          placeholder="Type CC number..." />
      </label>

      <div *ngIf="templateCtrl.errors?.['creditCard']" class="error">
        Invalid credit card number.
      </div>

      <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
        Valid credit card number!
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
export class CreditCardDemoComponent {
  control = new FormControl(null, creditCard);
  templateValue: string | null = null;
}
