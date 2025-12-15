import { isPresent } from './is-present';

describe('isPresent', () => {
    it('should return true for defined values', () => {
        expect(isPresent(1)).toBe(true);
        expect(isPresent('str')).toBe(true);
        expect(isPresent({})).toBe(true);
        expect(isPresent([])).toBe(true);
        expect(isPresent(0)).toBe(true);
        expect(isPresent(false)).toBe(true);
        expect(isPresent('')).toBe(true);
    });

    it('should return false for null', () => {
        expect(isPresent(null)).toBe(false);
    });

    it('should return false for undefined', () => {
        expect(isPresent(undefined)).toBe(false);
    });
});
