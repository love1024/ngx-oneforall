import { Component } from '@angular/core';
import { TypedTemplateDirective } from '@ngx-oneforall/guards';

interface Row {
  index: number;
  name: string;
  age: number;
}

@Component({
  selector: 'lib-typed-template-guard-demo',
  imports: [TypedTemplateDirective],
  template: `
    <ng-template let-name="name" [typedTemplate]="type">
      <p>Name</p>
    </ng-template>
  `,
  styleUrl: './typed-template-guard-demo.component.scss',
})
export class TypedTemplateGuardDemoComponent {
  get type() {
    return {} as Row;
  }
}
