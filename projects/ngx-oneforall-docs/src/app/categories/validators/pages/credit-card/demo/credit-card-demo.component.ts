import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  creditCard,
  CreditCardValidator,
} from 'ngx-oneforall/validators/credit-card';

@Component({
  selector: 'app-credit-card-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CreditCardValidator
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
    
      @if (control.errors?.['creditCard']) {
        <div class="error">
          Invalid credit card number (Luhn check failed or invalid length).
        </div>
      }
    
      @if (control.valid && control.value) {
        <div class="success">
          Valid credit card number!
        </div>
      }
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
    
      @if (templateCtrl.errors?.['creditCard']) {
        <div class="error">
          Invalid credit card number.
        </div>
      }
    
      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">
          Valid credit card number!
        </div>
      }
    </div>
    `,
  styleUrl: './credit-card-demo.component.scss',
})
export class CreditCardDemoComponent {
  control = new FormControl(null, creditCard);
  templateValue: string | null = null;
}
