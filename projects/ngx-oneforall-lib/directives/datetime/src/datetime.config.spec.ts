import { PARTIAL_VALIDATORS } from './datetime.config';

describe('DateTime Config - Partial Validators', () => {
  describe('YYYY', () => {
    it('should validate correctly', () => {
      const validator = PARTIAL_VALIDATORS['YYYY'];
      expect(validator('2')).toBe(true);
      expect(validator('20')).toBe(true);
      expect(validator('202')).toBe(true);
      expect(validator('2024')).toBe(true);
      expect(validator('20245')).toBe(false); // too long
      expect(validator('A')).toBe(false);
    });
  });

  describe('YY', () => {
    it('should validate correctly', () => {
      const validator = PARTIAL_VALIDATORS['YY'];
      expect(validator('2')).toBe(true);
      expect(validator('24')).toBe(true);
      expect(validator('245')).toBe(false);
      expect(validator('A')).toBe(false);
    });
  });

  describe('MM', () => {
    const validator = PARTIAL_VALIDATORS['MM'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('1')).toBe(true);
      expect(validator('2')).toBe(false); // First digit must be 0 or 1
      expect(validator('12')).toBe(true);
      expect(validator('05')).toBe(true);
      expect(validator('13')).toBe(false);
      expect(validator('00')).toBe(false); // 00 is not valid based on regex often, checking regex: ^(0[1-9]|1[0-2])$
      // actually, partial check for '0' uses /^[01]$/, but '00' uses full regex.
      // 00 is NOT valid month.
    });
  });

  describe('M', () => {
    const validator = PARTIAL_VALIDATORS['M'];
    it('should validate correctly', () => {
      expect(validator('1')).toBe(true);
      expect(validator('2')).toBe(true);
      expect(validator('9')).toBe(true);
      expect(validator('10')).toBe(true);
      expect(validator('12')).toBe(true);
      expect(validator('13')).toBe(false);
      expect(validator('0')).toBe(false); // Regex /^(1[0-2]|[1-9])$/ for complete, partial logic is /^(1[0-2]?|[2-9])?$/
    });
  });

  describe('DD', () => {
    const validator = PARTIAL_VALIDATORS['DD'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('3')).toBe(true);
      expect(validator('4')).toBe(false); // First digit must be 0-3
      expect(validator('12')).toBe(true);
      expect(validator('31')).toBe(true);
      expect(validator('32')).toBe(false);
    });
  });

  describe('D', () => {
    const validator = PARTIAL_VALIDATORS['D'];
    it('should validate correctly', () => {
      // Regex: /^([12]\d?|3[01]?|[4-9])?$/
      expect(validator('1')).toBe(true);
      expect(validator('9')).toBe(true);
      expect(validator('31')).toBe(true);
      expect(validator('32')).toBe(false);
      expect(validator('0')).toBe(false);
    });
  });

  describe('HH (24-hour)', () => {
    const validator = PARTIAL_VALIDATORS['HH'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('2')).toBe(true);
      expect(validator('3')).toBe(false); // First digit 0-2
      expect(validator('23')).toBe(true);
      expect(validator('24')).toBe(false);
    });
  });

  describe('H (24-hour)', () => {
    const validator = PARTIAL_VALIDATORS['H'];
    it('should validate correctly', () => {
      // /^(1\d?|2[0-3]?|[0-9])?$/
      // Wait, H pattern is /^(1\d|2[0-3]|[0-9])$/ (0-23)
      // Partial:
      expect(validator('0')).toBe(true);
      expect(validator('9')).toBe(true);
      expect(validator('23')).toBe(true);
      expect(validator('24')).toBe(false);
    });
  });

  describe('hh (12-hour)', () => {
    const validator = PARTIAL_VALIDATORS['hh'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('1')).toBe(true);
      expect(validator('2')).toBe(false); // First digit 0-1
      expect(validator('12')).toBe(true);
      expect(validator('13')).toBe(false);
      expect(validator('00')).toBe(false);
    });
  });

  describe('h (12-hour)', () => {
    const validator = PARTIAL_VALIDATORS['h'];
    it('should validate correctly', () => {
      expect(validator('1')).toBe(true);
      expect(validator('12')).toBe(true);
      expect(validator('13')).toBe(false);
      expect(validator('0')).toBe(false);
    });
  });

  describe('mm (Minutes)', () => {
    const validator = PARTIAL_VALIDATORS['mm'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('5')).toBe(true);
      expect(validator('6')).toBe(false); // First digit 0-5
      expect(validator('59')).toBe(true);
      expect(validator('60')).toBe(false);
    });
  });

  describe('m (Minutes)', () => {
    const validator = PARTIAL_VALIDATORS['m'];
    it('should validate correctly', () => {
      expect(validator('0')).toBe(true);
      expect(validator('59')).toBe(true);
      expect(validator('60')).toBe(false);
    });
  });

  describe('ss (Seconds)', () => {
    const validator = PARTIAL_VALIDATORS['ss'];
    it('should validate correctly', () => {
      expect(validator('')).toBe(true);
      expect(validator('0')).toBe(true);
      expect(validator('5')).toBe(true);
      expect(validator('6')).toBe(false); // First digit 0-5
      expect(validator('59')).toBe(true);
      expect(validator('60')).toBe(false);
    });
  });

  describe('s (Seconds)', () => {
    const validator = PARTIAL_VALIDATORS['s'];
    it('should validate correctly', () => {
      expect(validator('0')).toBe(true);
      expect(validator('59')).toBe(true);
      expect(validator('60')).toBe(false);
    });
  });

  describe('A/a (AM/PM)', () => {
    it('should validate A', () => {
      const validator = PARTIAL_VALIDATORS['A'];
      expect(validator('A')).toBe(true);
      expect(validator('P')).toBe(true);
      expect(validator('AM')).toBe(true);
      expect(validator('PM')).toBe(true);
      expect(validator('Z')).toBe(false);
    });

    it('should validate a', () => {
      const validator = PARTIAL_VALIDATORS['a'];
      expect(validator('a')).toBe(true);
      expect(validator('p')).toBe(true);
      expect(validator('am')).toBe(true);
      expect(validator('pm')).toBe(true);
      expect(validator('z')).toBe(false);
    });
  });
});
