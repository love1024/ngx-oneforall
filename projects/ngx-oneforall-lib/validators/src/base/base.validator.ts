import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive()
export abstract class BaseValidator implements Validator {
    protected validator: ValidatorFn | null = null;
    protected onChange?: () => void;

    validate(control: AbstractControl): ValidationErrors | null {
        return this.validator ? this.validator(control) : null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }

    ngOnChanges(): void {
        if (this.onChange) {
            this.onChange();
        }
    }
}
