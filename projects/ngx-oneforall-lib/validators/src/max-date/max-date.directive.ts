import { Directive, effect, forwardRef, input } from "@angular/core";
import { BaseValidator } from "../base/base.validator";
import { maxDate } from "./max-date.validator";
import { NG_VALIDATORS } from "@angular/forms";
import { isPresent } from "@ngx-oneforall/utils";


@Directive({
    selector: '[maxDate][formControlName],[maxDate][formControl],[maxDate][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MaxDateDirective),
            multi: true
        }
    ]
})
export class MaxDateDirective extends BaseValidator {
    maxDate = input<string | Date | null>(null);

    constructor() {
        super();

        effect(() => {
            const maxDateValue = this.maxDate();
            if (isPresent(maxDateValue)) {
                this.validator = maxDate(maxDateValue);
            } else {
                this.validator = null;
            }

            this.onChange?.();
        })
    }
}