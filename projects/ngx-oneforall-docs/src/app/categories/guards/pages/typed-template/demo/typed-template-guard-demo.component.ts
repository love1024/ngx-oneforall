import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { TypedTemplateDirective } from '@ngx-oneforall/guards/typed-template';

interface User {
  id: number;
  fullName: string;
  years: number;
}

@Component({
  selector: 'lib-typed-template-guard-demo',
  imports: [TypedTemplateDirective, NgTemplateOutlet],
  template: `
    <div class="demo-container">
      <h2>Typed NgTemplate Demo</h2>
      <p>
        This demo showcases how to use <strong>typed templates</strong> in
        Angular for improved type safety and clarity.
      </p>
      <ng-container
        *ngTemplateOutlet="userTemplate; context: userContext"></ng-container>

      <!-- The context is strictly typed and only properties given in the type can be
      accessed -->
      <ng-template
        #userTemplate
        let-fullName="fullName"
        let-years="years"
        [typedTemplate]="userType">
        <div class="user-card">
          <span class="label">Full Name:</span>
          <span class="value">{{ fullName }}</span>
          <br />
          <span class="label">Age:</span>
          <span class="value">{{ years }}</span>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
    .demo-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 1.5rem;
      border-radius: 8px;
      background: #f9f9fc;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    h2 {
      margin-bottom: 0.5rem;
      color: #2d3a4b;
    }
    .user-card {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
    }
    .label {
      font-weight: 600;
      color: #4a5568;
    }
    .value {
      margin-left: 0.5rem;
      color: #2b6cb0;
    }
  `,
})
export class TypedTemplateGuardDemoComponent {
  userContext: User = { id: 1, fullName: 'Jane Doe', years: 29 };

  // Provide type information for the typed template directive
  get userType() {
    return {} as User;
  }
}
