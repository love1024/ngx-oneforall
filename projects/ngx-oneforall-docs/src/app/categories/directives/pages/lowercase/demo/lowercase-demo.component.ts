import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LowercaseDirective } from 'ngx-oneforall/directives/lowercase';

@Component({
  selector: 'lib-lowercase-demo',
  imports: [ReactiveFormsModule, LowercaseDirective],
  template: `
    <div class="demo-container">
      <h3>Lowercase Directive Demo</h3>

      <div class="field-group">
        <label>
          <input type="checkbox" [formControl]="updateOutputControl" />
          Update Model Value (updateOutput)
        </label>
      </div>

      <div class="field-group">
        <label for="standard-input">Standard Input:</label>
        <input
          id="standard-input"
          type="text"
          lowercase
          [updateOutput]="updateOutputControl.value!"
          placeholder="Type here..." />
      </div>

      <div class="field-group">
        <label for="form-control-input">With FormControl:</label>
        <input
          id="form-control-input"
          type="text"
          [formControl]="control"
          lowercase
          [updateOutput]="updateOutputControl.value!"
          placeholder="Bound control..." />
        <div class="value-display">Control Value: {{ control.value }}</div>
      </div>
    </div>
  `,
  styles: `
    .demo-container {
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .field-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    input[type='text'] {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
      max-width: 300px;
    }
    .value-display {
      margin-top: 0.5rem;
      font-size: 0.9em;
      color: #666;
    }
  `,
})
export class LowercaseDemoComponent {
  control = new FormControl('');
  updateOutputControl = new FormControl(true);
}
