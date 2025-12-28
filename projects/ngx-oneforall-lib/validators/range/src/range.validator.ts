import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { isNumberString, isNumberValue } from '@ngx-oneforall/utils/is-number';
import { isPresent } from '@ngx-oneforall/utils/is-present';

export function range(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isPresent(min) || !isPresent(max)) return null;
    else if (isPresent(Validators.required(control))) return null;

    const value = control.value;
    if (!isNumberValue(value) && !isNumberString(value)) return null;

    const numberValue = +control.value;

    return numberValue >= min && numberValue <= max
      ? null
      : {
          range: {
            min,
            max,
            actualValue: numberValue,
          },
        };
  };
}
