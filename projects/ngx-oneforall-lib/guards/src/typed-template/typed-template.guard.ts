import { Directive, inject, input, TemplateRef } from '@angular/core';

type TypedContext<T> = T & { $implicit: T; typedTemplate: T };

@Directive({
  selector: 'ng-template[typedTemplate]',
})
export class TypedTemplateDirective<T> {
  typedTemplate = input<T>();

  private template = inject(TemplateRef<TypedContext<T>>);

  static ngTemplateGuard_typedTemplate = 'binding' as const;

  static ngTemplateContextGuard<T>(
    dir: TypedTemplateDirective<T>,
    ctx: unknown
  ): ctx is TypedContext<T> {
    return true;
  }
}
