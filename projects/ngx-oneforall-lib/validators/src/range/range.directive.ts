import {
    Directive,
    effect,
    forwardRef,
    input
} from '@angular/core';
import {
    NG_VALIDATORS
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils';
import { range } from './range.validator';
import { BaseValidator } from '../base/base.validator';

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
export class RangeValidator extends BaseValidator {

    /**
     * Usage:
     * [range]="[min, max]"
     */
    range = input<[number, number] | null>(null);

    constructor() {
        super();
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
}
