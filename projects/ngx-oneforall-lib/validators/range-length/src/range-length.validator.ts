import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils/is-present';

export function rangeLength(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isPresent(min) || !isPresent(max)) return null;
    if (isPresent(Validators.required(control))) return null;

    const value = control.value;

    let length: number | null = null;

    if (typeof value === 'string' || Array.isArray(value)) {
      length = value.length;
    } else if (typeof value === 'number') {
      length = value.toString().length;
    }

    if (length == null) return null;

    return length >= min && length <= max
      ? null
      : {
          rangeLength: {
            requiredMinLength: min,
            requiredMaxLength: max,
            actualLength: length,
          },
        };
  };
}
