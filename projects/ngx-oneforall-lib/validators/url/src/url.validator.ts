import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export interface UrlValidatorOptions {
  protocols?: readonly string[];
  skipProtocol?: boolean;
}

/**
 * Validator that checks if the control's value is a valid URL.
 * It strictly validates absolute URLs by default, but can allow missing protocols via options.
 *
 * @param options - Configuration options for URL validation:
 *   - `protocols`: List of allowed protocols (e.g., `['http', 'https']`). If provided, validates protocol matches.
 *   - `skipProtocol`: If `true`, allows keys like `google.com` to be valid by tentatively prepending `http://`.
 * @returns A validator function that returns error object if invalid, or `null` if valid.
 */
export function url(options: UrlValidatorOptions = {}): ValidatorFn {
  const { protocols, skipProtocol = false } = options;

  return (control: AbstractControl): ValidationErrors | null => {
    if (Validators.required(control)) return null;

    const value = control.value;
    if (typeof value !== 'string') {
      return { url: { actualValue: value } };
    }

    try {
      // First try strict absolute URL parsing
      const absoluteUrl = new URL(value);

      // If absolute, verify protocol if required
      if (protocols?.length) {
        const protocol = absoluteUrl.protocol.replace(':', '');
        if (!protocols.includes(protocol)) {
          return {
            url: {
              protocols,
              actualProtocol: protocol,
            },
          };
        }
      }
      return null;
    } catch {
      // If absolute parsing failed, check if skipProtocol is allowed
      if (skipProtocol) {
        try {
          // Try parsing by extracting/prepending http to see if it's a valid domain/path structure
          new URL('http://' + value);
          // If successful, we consider it valid without protocol
          return null;
        } catch {
          return { url: { actualValue: value } };
        }
      }

      return { url: { actualValue: value } };
    }
  };
}
