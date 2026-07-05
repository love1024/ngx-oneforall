import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import {
  url as originalUrl,
  UrlValidatorOptions,
} from 'ngx-oneforall/validators/url';

export type UrlFailureReason =
  | 'unsupported_type'
  | 'invalid_protocol'
  | 'invalid_format';

export interface UrlSignalValidatorOptions extends UrlValidatorOptions {
  message?: string | Partial<Record<UrlFailureReason, string>>;
}

/**
 * Signal Form validator that checks if the control's value is a valid URL.
 *
 * @param path The path of the field in the form schema.
 * @param options Optional configuration for the validation.
 */
export function url(
  path: SchemaPath<string | null | undefined>,
  options?: UrlSignalValidatorOptions
): void {
  const validator = originalUrl(options);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error && error['url']) {
      const details = error['url'];
      const reason = details.reason as UrlFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'url',
        message: msg,
      };
    }

    return null;
  });
}
