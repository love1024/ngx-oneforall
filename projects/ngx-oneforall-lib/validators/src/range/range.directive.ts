import {
    Directive,
    effect,
    forwardRef,
    input
} from '@angular/core';
import {
    AbstractControl,
    NG_VALIDATORS,
    ValidationErrors,
    Validator,
    ValidatorFn
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils';
import { range } from './range.validator';

@Directive({
    selector: '[range][formControlName],[range][formControl],[range][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RangeValidator),
            multi: true
        }
    ]
})
export class RangeValidator implements Validator {

    /**
     * Usage:
     * [range]="[min, max]"
     */
    range = input<[number, number] | null>(null);

    private validator: ValidatorFn | null = null;
    private onChange?: () => void;

    constructor() {
        effect(() => {
            const value = this.range();

            if (!isPresent(value)) {
                this.validator = null;
            } else {
                const [min, max] = value;
                this.validator = range(min, max);
            }

            this.onChange?.();
        });
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.validator ? this.validator(control) : null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }
}
