import { getExpectedLength, isQuantifier } from './mask.utils';
import { patterns } from './mask.config';

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

    it('should return false for non-pattern characters', () => {
      expect(isQuantifier('-')).toBe(false);
      expect(isQuantifier('/')).toBe(false);
      expect(isQuantifier(' ')).toBe(false);
    });
  });

  describe('getExpectedLength', () => {
    it('should count only pattern characters for simple masks', () => {
      expect(getExpectedLength('###', patterns)).toBe(3);
      expect(getExpectedLength('@@@@', patterns)).toBe(4);
    });

    it('should not include non-pattern chars in count', () => {
      // Only # patterns are counted, not - or ()
      expect(getExpectedLength('###-####', patterns)).toBe(7);
      expect(getExpectedLength('(###) ###-####', patterns)).toBe(10);
    });

    it('should exclude optional patterns (?)', () => {
      // ###- has 3 required #, the rest are optional
      expect(getExpectedLength('###-#?#?#?#?', patterns)).toBe(3);
      expect(getExpectedLength('#?#?#', patterns)).toBe(1);
    });

    it('should exclude zero-or-more patterns (*)', () => {
      // $ is not a pattern, so it's not counted; only required # before * if any
      expect(getExpectedLength('$#*', patterns)).toBe(0);
      expect(getExpectedLength('@*', patterns)).toBe(0);
    });

    it('should handle mixed masks correctly', () => {
      // ##:## has 4 required patterns, :#?#? has 0
      expect(getExpectedLength('##:##:#?#?', patterns)).toBe(4);
      // @#@ #@# has 6 required patterns (@, #, @, #, @, #)
      expect(getExpectedLength('@#@ #@#', patterns)).toBe(6);
    });

    it('should return 0 for empty mask', () => {
      expect(getExpectedLength('', patterns)).toBe(0);
    });

    it('should return 0 for mask with only optional patterns', () => {
      expect(getExpectedLength('#?#?#?', patterns)).toBe(0);
      expect(getExpectedLength('#*', patterns)).toBe(0);
    });

    it('should skip standalone quantifiers at start of mask', () => {
      // Quantifier at start is not preceded by a pattern
      expect(getExpectedLength('?##', patterns)).toBe(2);
      expect(getExpectedLength('*##', patterns)).toBe(2);
      expect(getExpectedLength('?*##', patterns)).toBe(2);
    });
  });
});
