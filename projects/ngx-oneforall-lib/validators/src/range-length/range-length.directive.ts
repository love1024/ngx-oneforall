import {
    Directive,
    effect,
    forwardRef,
    input,
    Signal
} from '@angular/core';
import {
    AbstractControl,
    NG_VALIDATORS,
    ValidationErrors,
    Validator,
    ValidatorFn
} from '@angular/forms';
import { rangeLength } from './range-length.validator';
import { isPresent } from '@ngx-oneforall/utils';

@Directive({
    selector: '[rangeLength][formControlName],[rangeLength][formControl],[rangeLength][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RangeLengthValidator),
            multi: true
        }
    ]
})
export class RangeLengthValidator implements Validator {

    /**
     * Usage:
     * [rangeLength]="[min, max]"
     */
    range = input<[number, number] | null>(null, { alias: 'rangeLength' });

    private validator: ValidatorFn | null = null;
    private onChange?: () => void;

    constructor() {
        effect(() => {
            const value = this.range();

            if (!isPresent(value)) {
                this.validator = null;
            } else {
                const [min, max] = value;
                this.validator = rangeLength(min, max);
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
