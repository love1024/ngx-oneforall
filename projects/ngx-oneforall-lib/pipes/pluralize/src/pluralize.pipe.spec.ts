/* eslint-disable @typescript-eslint/no-explicit-any */
import { PluralizePipe } from './pluralize.pipe';

describe('PluralizePipe', () => {
  let pipe: PluralizePipe;

  beforeEach(() => {
    pipe = new PluralizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Basic pluralization', () => {
    it('should return singular form for 1', () => {
      expect(pipe.transform(1, 'apple')).toBe('1 apple');
    });

    it('should return plural form for 0', () => {
      expect(pipe.transform(0, 'apple')).toBe('0 apples');
    });

    it('should return plural form for 2', () => {
      expect(pipe.transform(2, 'apple')).toBe('2 apples');
    });

    it('should return plural form for negative numbers', () => {
      expect(pipe.transform(-5, 'apple')).toBe('-5 apples');
    });

    it('should handle string numbers', () => {
      expect(pipe.transform('3', 'apple')).toBe('3 apples');
    });
  });

  describe('Custom plural forms', () => {
    it('should use custom plural form when provided', () => {
      expect(pipe.transform(2, 'person', 'people')).toBe('2 people');
    });

    it('should use custom plural form for 0', () => {
      expect(pipe.transform(0, 'child', 'children')).toBe('0 children');
    });

    it('should use singular form for 1 even with custom plural', () => {
      expect(pipe.transform(1, 'person', 'people')).toBe('1 person');
    });
  });

  describe('Auto-pluralization rules', () => {
    it('should add "es" for words ending in s', () => {
      expect(pipe.transform(2, 'bus')).toBe('2 buses');
    });

    it('should add "es" for words ending in x', () => {
      expect(pipe.transform(2, 'box')).toBe('2 boxes');
    });

    it('should add "es" for words ending in z', () => {
      expect(pipe.transform(2, 'quiz')).toBe('2 quizes');
    });

    it('should add "es" for words ending in ch', () => {
      expect(pipe.transform(2, 'church')).toBe('2 churches');
    });

    it('should add "es" for words ending in sh', () => {
      expect(pipe.transform(2, 'dish')).toBe('2 dishes');
    });

    it('should change y to ies for consonant + y', () => {
      expect(pipe.transform(2, 'city')).toBe('2 cities');
    });

    it('should add s for vowel + y', () => {
      expect(pipe.transform(2, 'boy')).toBe('2 boys');
    });

    it('should add s for regular words', () => {
      expect(pipe.transform(2, 'cat')).toBe('2 cats');
    });
  });

  describe('includeNumber flag', () => {
    it('should include number by default', () => {
      expect(pipe.transform(5, 'apple')).toBe('5 apples');
    });

    it('should exclude number when includeNumber is false', () => {
      expect(pipe.transform(5, 'apple', undefined, false)).toBe('apples');
    });

    it('should return singular without number when includeNumber is false', () => {
      expect(pipe.transform(1, 'apple', undefined, false)).toBe('apple');
    });

    it('should work with custom plural and includeNumber false', () => {
      expect(pipe.transform(2, 'person', 'people', false)).toBe('people');
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined value as 0', () => {
      expect(pipe.transform(null as any, 'apple')).toBe('0 apples');
      expect(pipe.transform(undefined as any, 'apple')).toBe('0 apples');
    });

    it('should throw error if singular is null', () => {
      expect(() => pipe.transform(1, null as any)).toThrow(
        'pluralize pipe requires at least a singular form'
      );
    });

    it('should throw error if singular is undefined', () => {
      expect(() => pipe.transform(1, undefined as any)).toThrow(
        'pluralize pipe requires at least a singular form'
      );
    });

    it('should throw error if singular form is empty string', () => {
      expect(() => pipe.transform(1, '')).toThrow(
        'pluralize pipe requires at least a singular form'
      );
    });

    it('should handle decimal numbers', () => {
      expect(pipe.transform(1.5, 'apple')).toBe('1.5 apples');
    });

    it('should trim whitespace from forms', () => {
      expect(pipe.transform(2, '  apple  ', '  apples  ')).toBe('2 apples');
    });

    it('should handle empty string plural form', () => {
      // Empty string is falsy, so it triggers auto-pluralization
      expect(pipe.transform(2, 'apple', '')).toBe('2 apples');
    });

    it('should throw for whitespace-only singular form after trimming', () => {
      expect(() => pipe.transform(2, '   ')).toThrow(
        'pluralize pipe requires at least a singular form'
      );
    });
  });

  describe('Case preservation', () => {
    it('should preserve case in original word', () => {
      expect(pipe.transform(2, 'Apple')).toBe('2 Apples');
    });

    it('should preserve case for y -> ies rule', () => {
      expect(pipe.transform(2, 'City')).toBe('2 Cities');
    });
  });
});
