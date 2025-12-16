import { Directive, forwardRef } from "@angular/core";
import { BaseValidator } from "../base/base.validator";
import { creditCard } from "./credit-card.validator";
import { NG_VALIDATORS } from "@angular/forms";

@Directive({
    selector: '[creditCard][formControlName],[creditCard][formControl],[creditCard][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CreditCardValidator),
            multi: true
        }
    ]
})
export class CreditCardValidator extends BaseValidator {
    constructor() {
        super();
        this.validator = creditCard;
    }
}