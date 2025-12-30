import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { TypedTemplateDirective } from 'ngx-oneforall/directives/typed-template';

interface User {
  id: number;
  fullName: string;
  years: number;
}

@Component({
  selector: 'lib-typed-template-directive-demo',
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
  styleUrl: './typed-template-directive-demo.component.scss',
})
export class TypedTemplateDirectiveDemoComponent {
  userContext: User = { id: 1, fullName: 'Jane Doe', years: 29 };

  // Provide type information for the typed template directive
  get userType() {
    return {} as User;
  }
}
