import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import {
  rangeLength,
  RangeLengthValidator,
} from 'ngx-oneforall/validators/range-length';

@Component({
  selector: 'app-range-length-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RangeLengthValidator
],
  template: `
    <div class="demo-container">
      <h3>Reactive Form</h3>
      <label>
        Enter text (length 5-10):
        <input [formControl]="control" placeholder="Type here..." />
      </label>
    
      @if (control.errors?.['rangeLength']; as error) {
        <div class="error">
          Length must be between {{ error.requiredMinLength }} and
          {{ error.requiredMaxLength }}. Current: {{ error.actualLength }}
        </div>
      }
    
      @if (control.valid && control.value) {
        <div class="success">
          Valid length!
        </div>
      }
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
    
      @if (templateCtrl.errors?.['rangeLength']; as error) {
        <div class="error">
          Length must be between {{ error.requiredMinLength }} and
          {{ error.requiredMaxLength }}. Current: {{ error.actualLength }}
        </div>
      }
    
      @if (templateCtrl.valid && templateCtrl.value) {
        <div class="success">
          Valid length!
        </div>
      }
    </div>
    `,
  styleUrl: './range-length-demo.component.scss',
})
export class RangeLengthDemoComponent {
  control = new FormControl('', rangeLength(5, 10));
  templateValue = '';
}
