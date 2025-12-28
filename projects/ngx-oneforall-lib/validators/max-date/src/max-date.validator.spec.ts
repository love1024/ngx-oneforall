import { FormControl } from '@angular/forms';
import { maxDate } from './max-date.validator';

describe('maxDate', () => {
    const MAX_DATE = new Date('2023-01-01');

    it('should throw error if invalid max date is provided', () => {
        expect(() => maxDate(new Date('invalid'))).toThrowError('maxDate: invalid date provided as maximum.');
        expect(() => maxDate('invalid-date-string')).toThrowError('maxDate: invalid date provided as maximum.');
    });

    it('should be valid for null/undefined/empty string', () => {
        const validator = maxDate(MAX_DATE);
        expect(validator(new FormControl(null))).toBeNull();
        expect(validator(new FormControl(undefined))).toBeNull();
        expect(validator(new FormControl(''))).toBeNull();
    });

    it('should be valid if value is less than or equal to max date', () => {
        const validator = maxDate(MAX_DATE);
        // Equal
        expect(validator(new FormControl(new Date('2023-01-01')))).toBeNull();
        // Less
        expect(validator(new FormControl(new Date('2022-12-31')))).toBeNull();
    });

    it('should be valid with string values that parse to valid dates <= max date', () => {
        const validator = maxDate(MAX_DATE);
        expect(validator(new FormControl('2022-12-31'))).toBeNull();
        expect(validator(new FormControl('2022-01-01'))).toBeNull();
    });

    it('should return error if value is greater than max date', () => {
        const validator = maxDate(MAX_DATE);
        const actualDate = new Date('2024-12-31');

        const result = validator(new FormControl(actualDate));
        expect(result).toEqual({
            maxDate: {
                requiredDate: MAX_DATE,
                actualValue: actualDate
            }
        });
    });

    it('should return error if string value parses to date greater than max date', () => {
        const validator = maxDate(MAX_DATE);
        const actualValue = '2024-12-31';

        const result = validator(new FormControl(actualValue));
        expect(result).toBeTruthy();
        expect(result!['maxDate']).toBeDefined();
        expect(result!['maxDate'].requiredDate).toEqual(MAX_DATE);
        expect(result!['maxDate'].actualValue).toBeInstanceOf(Date);
        expect(result!['maxDate'].actualValue.toISOString()).toContain('2024-12-31');
    });

    it('should rely on underlying date validator for invalid formats', () => {
        const validator = maxDate(MAX_DATE);
        // 'invalid-date' will be caught by date() validator check first
        expect(validator(new FormControl('invalid-date'))).toEqual({
            date: { actualValue: 'invalid-date' }
        });
    });
});
