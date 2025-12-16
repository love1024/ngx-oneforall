import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isNumberString, isNumberValue, isPresent } from '@ngx-oneforall/utils';

export const number: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (Validators.required(control)) return null;

    const value = control.value;

    return isNumberValue(value) || isNumberString(value)
        ? null
        : { number: { actualValue: value } };
};
