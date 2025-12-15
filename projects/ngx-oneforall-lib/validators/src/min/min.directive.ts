import { Directive, effect, forwardRef, input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import { isPresent } from "@ngx-oneforall/utils";
import { min } from "./min.validator";

@Directive({
    selector: '[min][formControlName],[min][formControl],[min][ngModel]',
    standalone: true,
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MinValidator),
            multi: true
        }
    ]
})
export class MinValidator implements Validator {
    min = input<number | null>(null);

    private validator: ValidatorFn | null = null;
    private onChange?: () => void;

    constructor() {
        effect(() => {
            const minValue = this.min();
            if (!isPresent(minValue)) {
                this.validator = null;
            } else {
                this.validator = min(minValue);
            }
            this.onChange?.();
        })
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.validator ? this.validator(control) : null;
    }

    registerOnValidatorChange?(fn: () => void): void {
        this.onChange = fn;
    }
}
