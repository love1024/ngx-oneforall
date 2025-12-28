import { FormControl } from '@angular/forms';
import { minDate } from './min-date.validator';

describe('minDate', () => {
    const MIN_DATE = new Date('2023-01-01');

    it('should throw error if invalid min date is provided', () => {
        expect(() => minDate(new Date('invalid'))).toThrowError('minDate: invalid date provided as minimum.');
        expect(() => minDate('invalid-date-string')).toThrowError('minDate: invalid date provided as minimum.');
    });

    it('should be valid for null/undefined/empty string', () => {
        const validator = minDate(MIN_DATE);
        expect(validator(new FormControl(null))).toBeNull();
        expect(validator(new FormControl(undefined))).toBeNull();
        expect(validator(new FormControl(''))).toBeNull();
    });

    it('should be valid if value is greater than or equal to min date', () => {
        const validator = minDate(MIN_DATE);
        // Equal
        expect(validator(new FormControl(new Date('2023-01-01')))).toBeNull();
        // Greater
        expect(validator(new FormControl(new Date('2023-01-02')))).toBeNull();
    });

    it('should be valid with string values that parse to valid dates >= min date', () => {
        const validator = minDate(MIN_DATE);
        expect(validator(new FormControl('2023-01-01'))).toBeNull();
        expect(validator(new FormControl('2023-02-01'))).toBeNull();
    });

    it('should return error if value is less than min date', () => {
        const validator = minDate(MIN_DATE);
        const actualDate = new Date('2022-12-31');

        const result = validator(new FormControl(actualDate));
        expect(result).toEqual({
            minDate: {
                requiredDate: MIN_DATE,
                actualValue: actualDate
            }
        });
    });

    it('should return error if string value parses to date less than min date', () => {
        const validator = minDate(MIN_DATE);
        const actualValue = '2022-12-31';
        // Note: The validator converts string input to Date object for the error return
        // We need to check if result matches the structure, but Date comparison might be strict equality in toEqual
        // So we just check properties
        const result = validator(new FormControl(actualValue));
        expect(result).toBeTruthy();
        expect(result!['minDate']).toBeDefined();
        expect(result!['minDate'].requiredDate).toEqual(MIN_DATE);
        // The actual value in error is a Date object created from the string
        expect(result!['minDate'].actualValue).toBeInstanceOf(Date);
        expect(result!['minDate'].actualValue.toISOString()).toContain('2022-12-31');
    });

    it('should rely on underlying date validator for invalid formats', () => {
        const validator = minDate(MIN_DATE);
        // 'invalid-date' will be caught by date() validator check first
        expect(validator(new FormControl('invalid-date'))).toEqual({
            date: { actualValue: 'invalid-date' }
        });
    });
});
