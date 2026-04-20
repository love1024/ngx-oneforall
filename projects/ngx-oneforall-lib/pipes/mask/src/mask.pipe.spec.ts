import { MaskPipe } from './mask.pipe';

describe('MaskPipe', () => {
  let pipe: MaskPipe;

  beforeEach(() => {
    pipe = new MaskPipe();
  });

  describe('basic masking', () => {
    it('should apply phone number mask', () => {
      expect(pipe.transform('1234567890', '(###) ###-####')).toBe(
        '(123) 456-7890'
      );
    });

    it('should apply date mask', () => {
      expect(pipe.transform('25122024', '##/##/####')).toBe('25/12/2024');
    });

    it('should apply time mask', () => {
      expect(pipe.transform('1430', '##:##')).toBe('14:30');
    });

    it('should apply IP address mask', () => {
      expect(pipe.transform('192168001001', '###.###.###.###')).toBe(
        '192.168.001.001'
      );
    });

    it('should apply SSN mask', () => {
      expect(pipe.transform('123456789', '###-##-####')).toBe('123-45-6789');
    });

    it('should handle partial input', () => {
      expect(pipe.transform('123', '(###) ###-####')).toBe('(123');
    });

    it('should truncate excess input', () => {
      expect(pipe.transform('12345678901234', '(###) ###-####')).toBe(
        '(123) 456-7890'
      );
    });
  });

  describe('null/empty handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null, '###')).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined, '###')).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('', '###')).toBe('');
    });
  });

  describe('number input', () => {
    it('should coerce number to string and apply mask', () => {
      expect(pipe.transform(1234567890, '(###) ###-####')).toBe(
        '(123) 456-7890'
      );
    });

    it('should handle zero', () => {
      expect(pipe.transform(0, '#')).toBe('0');
    });
  });

  describe('alpha patterns', () => {
    it('should apply alpha mask (@)', () => {
      expect(pipe.transform('ABCD', '@@-@@')).toBe('AB-CD');
    });

    it('should apply alphanumeric mask (A)', () => {
      expect(pipe.transform('A1B2', 'AA-AA')).toBe('A1-B2');
    });

    it('should apply uppercase mask (U)', () => {
      expect(pipe.transform('ABCD', 'UU-UU')).toBe('AB-CD');
    });

    it('should apply lowercase mask (L)', () => {
      expect(pipe.transform('abcd', 'LL-LL')).toBe('ab-cd');
    });

    it('should reject lowercase for uppercase mask', () => {
      expect(pipe.transform('abcd', 'UU-UU')).toBe('');
    });

    it('should reject uppercase for lowercase mask', () => {
      expect(pipe.transform('ABCD', 'LL-LL')).toBe('');
    });
  });

  describe('quantifiers', () => {
    it('should handle optional quantifier (?)', () => {
      expect(pipe.transform('123', '###-#?#?')).toBe('123');
    });

    it('should handle optional with value', () => {
      expect(pipe.transform('12345', '###-#?#?')).toBe('123-45');
    });

    it('should handle zero-or-more quantifier (*)', () => {
      expect(pipe.transform('12345', '##-#*')).toBe('12-345');
    });
  });

  describe('prefix and suffix', () => {
    it('should add prefix to masked output', () => {
      expect(
        pipe.transform('1234567890', '(###) ###-####', { prefix: '+1 ' })
      ).toBe('+1 (123) 456-7890');
    });

    it('should add suffix to masked output', () => {
      expect(pipe.transform('100', '###', { suffix: '%' })).toBe('100%');
    });

    it('should add both prefix and suffix', () => {
      expect(
        pipe.transform('1000', '####', { prefix: '$', suffix: '.00' })
      ).toBe('$1000.00');
    });

    it('should handle prefix on already-prefixed input', () => {
      // If input already has the prefix, it should be stripped before processing
      expect(
        pipe.transform('+1 1234567890', '(###) ###-####', { prefix: '+1 ' })
      ).toBe('+1 (123) 456-7890');
    });
  });

  describe('custom patterns', () => {
    it('should accept custom pattern', () => {
      expect(
        pipe.transform('abc123', 'XXX-###', {
          customPatterns: {
            X: { pattern: /[a-z]/ },
          },
        })
      ).toBe('abc-123');
    });
  });

  describe('removeSpecialCharacters config', () => {
    // This config changes the `raw` output, not the `masked` output.
    // Since the pipe returns `masked`, this primarily tests the option is accepted.
    it('should still return masked output regardless of removeSpecialCharacters', () => {
      const withRemove = pipe.transform('1234567890', '(###) ###-####', {
        removeSpecialCharacters: true,
      });
      const withoutRemove = pipe.transform('1234567890', '(###) ###-####', {
        removeSpecialCharacters: false,
      });
      expect(withRemove).toBe('(123) 456-7890');
      expect(withoutRemove).toBe('(123) 456-7890');
    });
  });
});
