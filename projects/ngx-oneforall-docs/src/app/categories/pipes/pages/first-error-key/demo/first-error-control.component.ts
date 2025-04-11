import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorKeyPipe } from 'ngx-oneforall';

@Component({
  selector: 'lib-first-error-control',
  imports: [ReactiveFormsModule, FirstErrorKeyPipe],
  template: `
    <label for="name">Name: </label>
    <input [formControl]="nameControl" name="name" placeholder="Enter name" />
    @if (nameControl.errors | firstErrorKey; as firstError) {
      <div>{{ errorMessages[firstError] }}</div>
    }
  `,
  styles: `
    input.ng-invalid.ng-touched {
      border-color: red;
    }
    input.ng-valid.ng-touched {
      border-color: green;
    }
    div {
      color: red;
      font-size: 12px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    div {
      margin-top: 5px;
      color: red;
      font-size: 12px;
      font-style: italic;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
  `,
})
export class FirstErrorControlComponent {
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  errorMessages: Record<string, string> = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters long',
  };
}
