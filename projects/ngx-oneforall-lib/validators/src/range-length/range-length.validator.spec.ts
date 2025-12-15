import { FormControl } from '@angular/forms';
import { rangeLength } from './range-length.validator';

describe('rangeLength', () => {
    it('should return null for null/undefined values', () => {
        const validator = rangeLength(5, 10);
        expect(validator(new FormControl(null))).toBeNull();
        expect(validator(new FormControl(undefined))).toBeNull();
    });

    it('should return null (valid) if min or max are not provided', () => {
        // @ts-ignore
        const validatorMinMissing = rangeLength(null, 5);
        expect(validatorMinMissing(new FormControl('abc'))).toBeNull();

        // @ts-ignore
        const validatorMaxMissing = rangeLength(2, null);
        expect(validatorMaxMissing(new FormControl('abc'))).toBeNull();
    });

    it('should return null for valid string length', () => {
        const validator = rangeLength(2, 5);
        expect(validator(new FormControl('ab'))).toBeNull();
        expect(validator(new FormControl('abc'))).toBeNull();
        expect(validator(new FormControl('abcde'))).toBeNull();
    });

    it('should return error for invalid string length', () => {
        const validator = rangeLength(2, 5);
        const error = {
            rangeLength: {
                requiredMinLength: 2,
                requiredMaxLength: 5,
                actualLength: 1
            }
        };

        expect(validator(new FormControl('a'))).toEqual(error); // Too short

        const longError = {
            rangeLength: {
                requiredMinLength: 2,
                requiredMaxLength: 5,
                actualLength: 6
            }
        };
        expect(validator(new FormControl('abcdef'))).toEqual(longError); // Too long
    });

    it('should return null for valid array length', () => {
        const validator = rangeLength(1, 3);
        expect(validator(new FormControl([1]))).toBeNull();
        expect(validator(new FormControl([1, 2]))).toBeNull();
        expect(validator(new FormControl([1, 2, 3]))).toBeNull();
    });

    it('should return error for invalid array length', () => {
        const validator = rangeLength(1, 2);
        const error = {
            rangeLength: {
                requiredMinLength: 1,
                requiredMaxLength: 2,
                actualLength: 0
            }
        };
        expect(validator(new FormControl([]))).toBeNull();
    });

    it('should return error for invalid non-empty array length', () => {
        const validator = rangeLength(2, 3);
        const error = {
            rangeLength: {
                requiredMinLength: 2,
                requiredMaxLength: 3,
                actualLength: 1
            }
        };
        expect(validator(new FormControl([1]))).toEqual(error);
    });

    it('should handle numbers by converting to string', () => {
        const validator = rangeLength(2, 3);
        expect(validator(new FormControl(12))).toBeNull(); // length 2
        expect(validator(new FormControl(123))).toBeNull(); // length 3

        const error = {
            rangeLength: {
                requiredMinLength: 2,
                requiredMaxLength: 3,
                actualLength: 1
            }
        };
        expect(validator(new FormControl(1))).toEqual(error);
    });

    it('should return null for unsupported types (e.g. object)', () => {
        const validator = rangeLength(2, 5);
        expect(validator(new FormControl({}))).toBeNull();
    });
});
