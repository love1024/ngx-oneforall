import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { isPresent } from "@ngx-oneforall/utils";

export function min(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!isPresent(min)) return null;
        else if (isPresent(Validators.required(control))) return null;
        const value = control.value;
        if ((typeof value !== 'number' && typeof value !== 'string') || isNaN(+value)) return null;

        const numberValue = +control.value;

        return numberValue >= min ? null : {
            min: {
                requiredValue: min,
                actualValue: numberValue
            }
        };
    }
}