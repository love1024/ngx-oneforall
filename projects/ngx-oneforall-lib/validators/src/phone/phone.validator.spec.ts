import { FormControl } from '@angular/forms';
import { phoneValidator } from './phone.validator';
import { CountryCode } from '@ngx-oneforall/constants';

describe('phoneValidator', () => {
    it('should be valid for null/undefined/empty string', () => {
        const validator = phoneValidator(CountryCode.UnitedStates);
        expect(validator(new FormControl(null))).toBeNull();
        expect(validator(new FormControl(undefined))).toBeNull();
        expect(validator(new FormControl(''))).toBeNull();
        expect(validator(new FormControl('   '))).toBeNull();
        expect(validator({} as any)).toBeNull();
    });

    it('should validate valid US phone numbers', () => {
        const validator = phoneValidator(CountryCode.UnitedStates);
        expect(validator(new FormControl('2025550125'))).toBeNull();
        expect(validator(new FormControl('(202) 555-0125'))).toBeNull();
        expect(validator(new FormControl('+1 202 555 0125'))).toBeNull();
    });

    it('should validate valid UK phone numbers', () => {
        const validator = phoneValidator(CountryCode.UnitedKingdom);
        expect(validator(new FormControl('07911 123456'))).toBeNull();
        expect(validator(new FormControl('+44 7911 123456'))).toBeNull();
    });

    it('should invalidate invalid phone numbers', () => {
        const validator = phoneValidator(CountryCode.UnitedStates);
        expect(validator(new FormControl('123'))).toEqual({ phone: true });
        expect(validator(new FormControl('invalid'))).toEqual({ phone: true });
        // Invalid number
        expect(validator(new FormControl('+1 202 555'))).toEqual({ phone: true });
    });
});
