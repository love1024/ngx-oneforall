import { forwardRef, Directive } from "@angular/core";
import { NG_VALIDATORS } from "@angular/forms";
import { BaseValidator } from "../base/base.validator";
import { number } from "./number.validator";


@Directive({
    selector: '[number][formControlName],[number][formControl],[number][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NumberValidator),
            multi: true
        }
    ]
})
export class NumberValidator extends BaseValidator {

    constructor() {
        super();
        this.validator = number;
    }
}