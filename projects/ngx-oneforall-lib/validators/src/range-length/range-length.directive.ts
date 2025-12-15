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
import { rangeLength } from './range-length';

@Directive({
    selector: '[rangeLength][formControlName],[rangeLength][formControl],[rangeLength][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RangeLengthDirective),
            multi: true
        }
    ]
})
export class RangeLengthDirective implements Validator {

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

            if (!value) {
                this.validator = null;
            } else {
                const [min, max] = value;
                this.validator =
                    typeof min === 'number' && typeof max === 'number'
                        ? rangeLength(min, max)
                        : null;
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
