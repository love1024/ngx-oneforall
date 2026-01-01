import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  matchFields,
  MatchFieldsValidator,
} from 'ngx-oneforall/validators/match-field';

@Component({
  selector: 'app-match-field-demo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatchFieldsValidator],
  template: `
    <div class="demo-container">
      <h3>Reactive Forms</h3>
      <form [formGroup]="reactiveForm">
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Enter password" />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            formControlName="confirmPassword"
            placeholder="Confirm password" />
        </div>

        @if (reactiveForm.hasError('matchFields')) {
          <div class="error">Passwords do not match</div>
        }

        @if (reactiveForm.valid && reactiveForm.get('password')?.value) {
          <div class="success">Passwords match!</div>
        }
      </form>
    </div>

    <div class="demo-container">
      <h3>Template-Driven Forms</h3>
      <form #templateForm="ngForm" [matchFields]="['email', 'confirmEmail']">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="email"
            required
            placeholder="Enter email" />
        </div>

        <div class="form-group">
          <label for="confirmEmail">Confirm Email:</label>
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            [(ngModel)]="confirmEmail"
            required
            placeholder="Confirm email" />
        </div>

        @if (templateForm.hasError('matchFields')) {
          <div class="error">Emails do not match</div>
        }

        @if (templateForm.valid && email) {
          <div class="success">Emails match!</div>
        }
      </form>
    </div>
  `,
  styleUrl: './match-field-demo.component.scss',
})
export class MatchFieldDemoComponent {
  // Reactive form
  reactiveForm = new FormGroup(
    {
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: matchFields('password', 'confirmPassword') }
  );

  // Template-driven form
  email = '';
  confirmEmail = '';
}
