import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberInputDirective } from 'ngx-oneforall/directives/number-input';

@Component({
  selector: 'lib-number-input-demo',
  standalone: true,
  imports: [NumberInputDirective, FormsModule],
  template: `
    <div class="demo-container">
      <h2>Number Input Directive Demo</h2>

      <div class="demo-block">
        <h3>Currency (Euro - de-DE)</h3>
        <p>Format on blur, raw on focus. Uses <code>de-DE</code> locale.</p>
        <input
          numberInput
          type="text"
          locale="de-DE"
          [options]="{ style: 'currency', currency: 'EUR' }"
          [(ngModel)]="val1"
          #model1="ngModel"
          class="demo-input"
          [class.ng-invalid]="model1.hasError('invalidNumber')" />
        @if (model1.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Currency (USD - en-US)</h3>
        <p>Uses <code>en-US</code> locale.</p>
        <input
          numberInput
          type="text"
          locale="en-US"
          [options]="{ style: 'currency', currency: 'USD' }"
          [(ngModel)]="val2"
          #model2="ngModel"
          class="demo-input"
          [class.ng-invalid]="model2.hasError('invalidNumber')" />
        @if (model2.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Percentage</h3>
        <p>Formatted as percentage on blur.</p>
        <input
          numberInput
          type="text"
          [options]="{ style: 'percent', maximumFractionDigits: 2 }"
          [(ngModel)]="val3"
          #model3="ngModel"
          class="demo-input"
          [class.ng-invalid]="model3.hasError('invalidNumber')" />
        @if (model3.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Unit (Kilometer-per-hour)</h3>
        <p>Display units natively supported by Intl.</p>
        <input
          numberInput
          type="text"
          locale="pt-PT"
          [options]="{
            style: 'unit',
            unit: 'kilometer-per-hour',
            unitDisplay: 'long',
          }"
          [(ngModel)]="val4"
          #model4="ngModel"
          class="demo-input"
          [class.ng-invalid]="model4.hasError('invalidNumber')" />
        @if (model4.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Standard Decimal with Grouping</h3>
        <p>Custom fraction digits and grouping enabled.</p>
        <input
          numberInput
          type="text"
          [options]="{ minimumFractionDigits: 2, useGrouping: true }"
          [(ngModel)]="val5"
          #model5="ngModel"
          class="demo-input"
          [class.ng-invalid]="model5.hasError('invalidNumber')" />
        @if (model5.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Positive Only (min="0")</h3>
        <p>Restricts typing negative signs. Active validation for 0+.</p>
        <input
          numberInput
          type="text"
          min="0"
          [(ngModel)]="val6"
          #model6="ngModel"
          class="demo-input"
          [class.ng-invalid]="model6.invalid" />
        @if (model6.hasError('min')) {
          <div class="error-message">Value must be at least 0!</div>
        }
      </div>

      <div class="demo-block">
        <h3>Range Restricted (10 - 100)</h3>
        <p>Validation for values outside [10, 100].</p>
        <input
          numberInput
          type="text"
          min="10"
          max="100"
          [(ngModel)]="val7"
          #model7="ngModel"
          class="demo-input"
          [class.ng-invalid]="model7.invalid" />
        @if (model7.hasError('min')) {
          <div class="error-message">Too small! (Min: 10)</div>
        }
        @if (model7.hasError('max')) {
          <div class="error-message">Too large! (Max: 100)</div>
        }
      </div>

      <div class="demo-block">
        <h3>Two-way Binding (ngModel)</h3>
        <p>
          Current model value: <strong>{{ value() }}</strong> ({{
            typeofValue(value())
          }})
        </p>
        <input
          numberInput
          type="text"
          [(ngModel)]="value"
          #model="ngModel"
          class="demo-input"
          [class.ng-invalid]="model.hasError('invalidNumber')" />
        @if (model.hasError('invalidNumber')) {
          <div class="error-message">Value is not a valid number!</div>
        }
      </div>
    </div>
  `,
  styleUrl: './number-input-demo.component.scss',
})
export class NumberInputDemoComponent {
  val1 = signal<number | null>(1234.56);
  val2 = signal<number | null>(1234.56);
  val3 = signal<number | null>(0.8567);
  val4 = signal<number | null>(120);
  val5 = signal<number | null>(9876543.1);
  val6 = signal<number | null>(42);
  val7 = signal<number | null>(50);
  value = signal<number | null>(1234.56);

  typeofValue(val: unknown): string {
    return typeof val;
  }
}
