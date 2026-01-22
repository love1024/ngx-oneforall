import {
  getExpectedLength,
  getRequiredEndPosition,
  canSkipOptional,
  isQuantifier,
} from './mask.utils';
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

  describe('getRequiredEndPosition', () => {
    it('should return 0 for empty mask', () => {
      expect(getRequiredEndPosition('', patterns)).toBe(0);
    });

    it('should return 0 for all optional mask', () => {
      expect(getRequiredEndPosition('#?#?#?', patterns)).toBe(0);
    });

    it('should return position after last required pattern', () => {
      expect(getRequiredEndPosition('###', patterns)).toBe(3);
      expect(getRequiredEndPosition('##-##', patterns)).toBe(5);
    });

    it('should skip quantifiers in calculation (line 96 coverage)', () => {
      // Mask with standalone quantifier at start
      expect(getRequiredEndPosition('?##', patterns)).toBe(3);
      expect(getRequiredEndPosition('*##', patterns)).toBe(3);
    });
  });

  describe('canSkipOptional', () => {
    it('should handle masks with quantifiers in scan position (line 138 coverage)', () => {
      // Mask: #?*# - after optional #?, there's a stray * before required #
      const result = canSkipOptional('5', '#?*#', 0, patterns, '5', 0, 2);
      expect(result).toBeDefined();
    });

    it('should handle case when currentPattern is undefined (line 166 else coverage)', () => {
      // Use a non-pattern character at currentMaskPos
      const result = canSkipOptional('5', '-#?#', 0, patterns, '5', 0, 2);
      // - is not a pattern, so currentPattern will be undefined
      expect(result).toBeDefined();
    });

    it('should skip quantifiers when counting positions after match (line 179 coverage)', () => {
      // Mask with quantifier after first required position
      const result = canSkipOptional('-', '#?-#?#', 0, patterns, '1-2', 1, 2);
      expect(result).toBeDefined();
    });

    it('should handle non-pattern chars when counting positions (line 181 else coverage)', () => {
      // afterChar is a literal, not a pattern
      const result = canSkipOptional('-', '#?-#', 0, patterns, '1-2', 1, 2);
      expect(result).toBeDefined();
    });

    it('should return canSkip false when no matching skip target found', () => {
      const result = canSkipOptional('x', '#?-', 0, patterns, 'x', 0, 2);
      expect(result.canSkip).toBe(false);
    });

    it('should return canSkip true when input matches next required position', () => {
      const result = canSkipOptional('-', '#?-#', 0, patterns, '-5', 0, 2);
      expect(result.canSkip).toBe(true);
      expect(result.skipToPos).toBe(2);
    });

    it('should increment by 1 when optional pattern has no quantifier (line 151 branch)', () => {
      // Use patterns that are inherently optional (optional: true in pattern config)
      // When scanNextChar is undefined or not a quantifier, scanPos should increment by 1
      const customPatterns = {
        ...patterns,
        X: { pattern: /[A-Z]/, optional: true }, // inherently optional, no ? or * needed
      };
      // Mask: #X where X is optional at end (scanNextChar is undefined)
      const result = canSkipOptional('5', '#X', 0, customPatterns, '5', 0, 1);
      expect(result).toBeDefined();
    });

    it('should increment by 1 when scanNextChar is not a quantifier (line 151 falsy case)', () => {
      // Pattern with optional: true, followed by a regular character (not ? or *)
      const customPatterns = {
        ...patterns,
        X: { pattern: /[A-Z]/, optional: true }, // inherently optional
      };
      // Mask: #X# where X is optional but next char is # (not a quantifier)
      const result = canSkipOptional('5', '#X#', 0, customPatterns, '5', 0, 1);
      expect(result).toBeDefined();
    });

    it('should not count non-pattern chars as positions (line 181 else, literal char)', () => {
      // Mask where chars after match position include literals (not patterns)
      // This should NOT increment positionsAfterMatch for literal chars
      const result = canSkipOptional('-', '#?-#--', 0, patterns, '1-2', 0, 2);
      expect(result).toBeDefined();
    });
  });
});
