import {
  extractDatePart,
  extractDatePartFromRaw,
  getDaysInMonth,
  getExpectedLength,
  getRawExpectedLength,
  isSeparator,
  isValidCompleteInput,
  isValidDay,
  isValidPartialInput,
  parseFormat,
} from './datetime.utils';

describe('DateTime Utils', () => {
  describe('parseFormat', () => {
    it('should parse standard format MM-DD-YYYY', () => {
      const tokens = parseFormat('MM-DD-YYYY');
      expect(tokens.length).toBe(5);
      expect(tokens[0]).toEqual(
        expect.objectContaining({ value: 'MM', isToken: true })
      );
      expect(tokens[1]).toEqual(
        expect.objectContaining({ value: '-', isToken: false })
      );
      expect(tokens[2]).toEqual(
        expect.objectContaining({ value: 'DD', isToken: true })
      );
      expect(tokens[3]).toEqual(
        expect.objectContaining({ value: '-', isToken: false })
      );
      expect(tokens[4]).toEqual(
        expect.objectContaining({ value: 'YYYY', isToken: true })
      );
    });

    it('should parse unknown characters as separators', () => {
      const tokens = parseFormat('MM*DD');
      expect(tokens.length).toBe(3);
      expect(tokens[1]).toEqual(
        expect.objectContaining({ value: '*', isToken: false })
      );
    });

    it('should handle formats ending with separators', () => {
      const tokens = parseFormat('MM-');
      expect(tokens.length).toBe(2);
      expect(tokens[1]).toEqual(
        expect.objectContaining({ value: '-', isToken: false })
      );
    });
  });

  describe('isValidPartialInput', () => {
    it('should validate MM', () => {
      expect(isValidPartialInput('1', 'MM')).toBe(true);
      expect(isValidPartialInput('12', 'MM')).toBe(true);
      expect(isValidPartialInput('13', 'MM')).toBe(false);
      expect(isValidPartialInput('0', 'MM')).toBe(true);
    });

    it('should validate DD', () => {
      expect(isValidPartialInput('3', 'DD')).toBe(true);
      expect(isValidPartialInput('31', 'DD')).toBe(true);
      expect(isValidPartialInput('32', 'DD')).toBe(false);
    });

    it('should validate YYYY', () => {
      expect(isValidPartialInput('202', 'YYYY')).toBe(true);
    });

    it('should return false for unknown tokens', () => {
      expect(isValidPartialInput('1', 'UNKNOWN')).toBe(false);
    });
  });

  describe('isValidCompleteInput', () => {
    it('should validate complete MM', () => {
      expect(isValidCompleteInput('12', 'MM')).toBe(true);
      expect(isValidCompleteInput('1', 'MM')).toBe(false); // too short
    });

    it('should return false for unknown tokens', () => {
      expect(isValidCompleteInput('12', 'UNKNOWN')).toBe(false);
    });
  });

  describe('isSeparator', () => {
    it('should identify default separators', () => {
      expect(isSeparator('-')).toBe(true);
      expect(isSeparator('/')).toBe(true);
      expect(isSeparator(':')).toBe(true);
      expect(isSeparator('.')).toBe(true);
      expect(isSeparator(' ')).toBe(true);
    });

    it('should reject non-separators', () => {
      expect(isSeparator('A')).toBe(false);
      expect(isSeparator('1')).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct days for standard months', () => {
      expect(getDaysInMonth(1, 2024)).toBe(31); // Jan
      expect(getDaysInMonth(4, 2024)).toBe(30); // Apr
    });

    it('should handle leap years (Feb)', () => {
      expect(getDaysInMonth(2, 2024)).toBe(29); // Leap year
      expect(getDaysInMonth(2, 2023)).toBe(28); // Standard year
    });
  });

  describe('isValidDay', () => {
    it('should validate correct days', () => {
      expect(isValidDay(31, 1, 2024)).toBe(true);
      expect(isValidDay(29, 2, 2024)).toBe(true);
    });

    it('should invalidate incorrect days', () => {
      expect(isValidDay(32, 1, 2024)).toBe(false);
      expect(isValidDay(30, 2, 2024)).toBe(false);
      expect(isValidDay(0, 1, 2024)).toBe(false); // day < 1
    });
  });

  describe('extractDatePart', () => {
    // extractDatePart uses formatted value tokens
    const format = 'MM-DD-YY'; // using YY for coverage
    const value = '12-25-24';

    it('should extract month', () => {
      expect(extractDatePart(value, format, 'month')).toBe(12);
    });

    it('should extract day', () => {
      expect(extractDatePart(value, format, 'day')).toBe(25);
    });

    it('should extract year (YY < 50 => 2000+)', () => {
      // 24 => 2024
      expect(extractDatePart(value, format, 'year')).toBe(2024);
    });

    it('should extract year (YY >= 50 => 1900+)', () => {
      expect(extractDatePart('12-25-99', format, 'year')).toBe(1999);
    });

    it('should return undefined if part not found in format', () => {
      expect(extractDatePart(value, format, 'hour')).toBeUndefined();
    });

    it('should return undefined if extracted value is NaN', () => {
      // 'MM' expects 2 digits. If we pass nonsense in that position:
      // But wait, the function slices by position.
      // MM is first 2 chars.
      expect(extractDatePart('AA-25-24', format, 'month')).toBeUndefined();
    });
  });

  describe('getExpectedLength', () => {
    it('should calculate length for format with separators', () => {
      // MM(2) + -(1) + DD(2) + -(1) + YYYY(4) = 10
      expect(getExpectedLength('MM-DD-YYYY')).toBe(10);
    });
  });

  describe('getRawExpectedLength', () => {
    it('should calculate length excluding separators', () => {
      // MM(2) + DD(2) + YYYY(4) = 8
      expect(getRawExpectedLength('MM-DD-YYYY')).toBe(8);
    });
  });

  describe('extractDatePartFromRaw', () => {
    const format = 'MM-DD-YY';
    const rawValue = '122524';

    it('should extract parts from raw value', () => {
      expect(extractDatePartFromRaw(rawValue, format, 'month')).toBe(12);
      expect(extractDatePartFromRaw(rawValue, format, 'day')).toBe(25);
      expect(extractDatePartFromRaw(rawValue, format, 'year')).toBe(2024);
    });

    it('should handle YY logic for raw value', () => {
      expect(extractDatePartFromRaw('122599', format, 'year')).toBe(1999);
    });

    it('should return undefined if part missing', () => {
      expect(extractDatePartFromRaw(rawValue, format, 'hour')).toBeUndefined();
    });

    it('should return undefined if NaN', () => {
      expect(extractDatePartFromRaw('AA2524', format, 'month')).toBeUndefined();
    });
  });
});
