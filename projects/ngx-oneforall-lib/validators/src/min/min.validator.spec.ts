import { FormControl, Validators } from '@angular/forms';
import { min } from './min.validator';

describe('min', () => {
    it('should return null for null/undefined values', () => {
        const validator = min(5);
        expect(validator(new FormControl(null))).toBeNull();
        expect(validator(new FormControl(undefined))).toBeNull();
    });

    it('should return null if min value is not present', () => {
        // @ts-ignore
        const validator = min(null);
        expect(validator(new FormControl(1))).toBeNull();
    });

    it('should return null for valid numbers (greater than or equal)', () => {
        const validator = min(5);
        expect(validator(new FormControl(5))).toBeNull();
        expect(validator(new FormControl(6))).toBeNull();
        expect(validator(new FormControl(100))).toBeNull();
    });

    it('should return error for invalid numbers (less than)', () => {
        const validator = min(5);
        const error = {
            min: {
                requiredValue: 5,
                actualValue: 4
            }
        };
        expect(validator(new FormControl(4))).toEqual(error);
        expect(validator(new FormControl(0))).toEqual({ min: { requiredValue: 5, actualValue: 0 } });
        expect(validator(new FormControl(-5))).toEqual({ min: { requiredValue: 5, actualValue: -5 } });
    });

    it('should handle string numbers by converting them', () => {
        const validator = min(5);
        expect(validator(new FormControl('5'))).toBeNull();
        expect(validator(new FormControl('6'))).toBeNull();

        const error = {
            min: {
                requiredValue: 5,
                actualValue: 4
            }
        };
        expect(validator(new FormControl('4'))).toEqual(error);
    });

    it('should return null for non-numeric strings', () => {
        const validator = min(5);
        expect(validator(new FormControl('abc'))).toBeNull();
    });
});
