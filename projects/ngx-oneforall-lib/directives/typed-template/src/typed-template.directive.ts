import { Directive, inject, input, TemplateRef } from '@angular/core';

type TypedContext<T> = T & { $implicit: T; typedTemplate: T };

/**
 * A directive that asserts the type of the context for an `ng-template`.
 * This allows for strict type checking of variables within the template.
 *
 * @typeParam T - The type of the context data.
 * @example
 * ```html
 * <ng-template [typedTemplate]="myType" let-item>
 *   <div>{{ item.name }}</div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[typedTemplate]',
})
export class TypedTemplateDirective<T> {
  /**
   * Input to infer the type `T`. Pass a value or a type-cast placeholder.
   */
  typedTemplate = input<T>();

  /**
   * The TemplateRef with the strongly typed context.
   */
  public template = inject(TemplateRef<TypedContext<T>>);

  /**
   * Tells Angular to use the input binding as the type guard.
   */
  static ngTemplateGuard_typedTemplate = 'binding' as const;

  /**
   * Type guard to assert the context type.
   */
  static ngTemplateContextGuard<T>(
    dir: TypedTemplateDirective<T>,
    ctx: unknown
  ): ctx is TypedContext<T> {
    return true;
  }
}
