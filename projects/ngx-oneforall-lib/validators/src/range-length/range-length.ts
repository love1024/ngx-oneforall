import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function rangeLength(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (min == null || max == null) return null;

        if (Validators.required(control)) return null;

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
                    actualLength: length
                }
            };
    };
}
