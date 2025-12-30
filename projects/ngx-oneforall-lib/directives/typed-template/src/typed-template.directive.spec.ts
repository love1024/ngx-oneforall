import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TypedTemplateDirective } from './typed-template.directive';

interface User {
  id: number;
  fullName: string;
  years: number;
}

@Component({
  template: `
    <ng-template
      #userTemplate
      let-fullName="fullName"
      let-years="years"
      [typedTemplate]="userType">
      {{ item.name }} - {{ typedTemplate.name }}
    </ng-template>
  `,
  imports: [TypedTemplateDirective],
})
class TestHostComponent {
  @ViewChild(TypedTemplateDirective) directive!: TypedTemplateDirective<{
    name: string;
  }>;
  @ViewChild('tpl', { read: TemplateRef }) templateRef!: TemplateRef<unknown>;

  userContext: User = { id: 1, fullName: 'Jane Doe', years: 29 };

  // Provide type information for the typed template directive
  get userType() {
    return {} as User;
  }
}

describe('TypedTemplateDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypedTemplateDirective, TestHostComponent],
    });
  });

  it('should create the directive and inject TemplateRef', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const directive = fixture.componentInstance.directive;
    expect(directive).toBeTruthy();
    expect(
      (directive as TypedTemplateDirective<unknown>).template
    ).toBeInstanceOf(TemplateRef);
  });

  it('should have static ngTemplateGuard_typedTemplate property', () => {
    expect(TypedTemplateDirective.ngTemplateGuard_typedTemplate).toBe(
      'binding'
    );
  });

  it('should have static ngTemplateContextGuard that returns true and narrows type', () => {
    const dir = {} as TypedTemplateDirective<{ name: string }>;
    const ctx = {
      name: 'test',
      $implicit: { name: 'test' },
      typedTemplate: { name: 'test' },
    };
    const result = TypedTemplateDirective.ngTemplateContextGuard(dir, ctx);
    expect(result).toBe(true);
  });
});
