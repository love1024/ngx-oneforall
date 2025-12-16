import { FormControl } from '@angular/forms';
import { number } from './number.validator';

describe('number', () => {
    it('should return null for null/undefined values', () => {
        expect(number(new FormControl(null))).toBeNull();
        expect(number(new FormControl(undefined))).toBeNull();
    });

    it('should return null for valid numbers', () => {
        expect(number(new FormControl(5))).toBeNull();
        expect(number(new FormControl(-10))).toBeNull();
        expect(number(new FormControl(0))).toBeNull();
        expect(number(new FormControl(3.14))).toBeNull();
    });

    it('should return null for valid numeric strings', () => {
        expect(number(new FormControl('5'))).toBeNull();
        expect(number(new FormControl('-10'))).toBeNull();
        expect(number(new FormControl('3.14'))).toBeNull();
    });

    it('should return error for non-numeric strings', () => {
        expect(number(new FormControl('abc'))).toEqual({
            number: { actualValue: 'abc' }
        });
        expect(number(new FormControl('12abc'))).toEqual({
            number: { actualValue: '12abc' }
        });
    });

    it('should return error for other types', () => {
        expect(number(new FormControl({}))).toEqual({
            number: { actualValue: {} }
        });
        expect(number(new FormControl(true))).toEqual({
            number: { actualValue: true }
        });
    });
});
