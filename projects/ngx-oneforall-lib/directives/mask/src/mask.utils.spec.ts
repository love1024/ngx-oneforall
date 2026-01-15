import { getExpectedLength, isQuantifier } from './mask.utils';

describe('Mask Utils', () => {
  describe('isQuantifier', () => {
    it('should return true for optional quantifier (?)', () => {
      expect(isQuantifier('?')).toBe(true);
    });

    it('should return true for zero-or-more quantifier (*)', () => {
      expect(isQuantifier('*')).toBe(true);
    });

    it('should return false for pattern characters', () => {
      expect(isQuantifier('#')).toBe(false);
      expect(isQuantifier('@')).toBe(false);
      expect(isQuantifier('A')).toBe(false);
    });

    it('should return false for separator characters', () => {
      expect(isQuantifier('-')).toBe(false);
      expect(isQuantifier('/')).toBe(false);
      expect(isQuantifier(' ')).toBe(false);
    });
  });

  describe('getExpectedLength', () => {
    it('should count all characters for simple masks', () => {
      expect(getExpectedLength('###')).toBe(3);
      expect(getExpectedLength('@@@@')).toBe(4);
    });

    it('should include separators in count', () => {
      expect(getExpectedLength('###-####')).toBe(8);
      expect(getExpectedLength('(###) ###-####')).toBe(14);
    });

    it('should exclude optional patterns (?)', () => {
      expect(getExpectedLength('###-#?#?#?#?')).toBe(4);
      expect(getExpectedLength('#?#?#')).toBe(1);
    });

    it('should exclude zero-or-more patterns (*)', () => {
      expect(getExpectedLength('$#*')).toBe(1);
      expect(getExpectedLength('@*')).toBe(0);
    });

    it('should handle mixed masks correctly', () => {
      expect(getExpectedLength('##:##:#?#?')).toBe(6);
      expect(getExpectedLength('@#@ #@#')).toBe(7);
    });

    it('should return 0 for empty mask', () => {
      expect(getExpectedLength('')).toBe(0);
    });

    it('should return 0 for mask with only optional patterns', () => {
      expect(getExpectedLength('#?#?#?')).toBe(0);
      expect(getExpectedLength('#*')).toBe(0);
    });

    it('should skip standalone quantifiers at start of mask', () => {
      // Quantifier at start is not preceded by a pattern
      expect(getExpectedLength('?##')).toBe(2);
      expect(getExpectedLength('*##')).toBe(2);
      expect(getExpectedLength('?*##')).toBe(2);
    });
  });
});
