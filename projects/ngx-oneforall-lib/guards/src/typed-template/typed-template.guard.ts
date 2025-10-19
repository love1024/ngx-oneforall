import { Directive, inject, input, TemplateRef } from '@angular/core';

type FlattenedContext<T> = T & { $implicit: T; typedTemplate: T };

@Directive({
  selector: 'ng-template[typedTemplate]',
})
export class TypedTemplateDirective<T> {
  typedTemplate = input<T>();

  private template = inject(TemplateRef<FlattenedContext<T>>);

  static ngTemplateGuard_typedTemplate = 'binding' as const;

  static ngTemplateContextGuard<T>(
    dir: TypedTemplateDirective<T>,
    ctx: unknown
  ): ctx is FlattenedContext<T> {
    return true;
  }
}
