/* eslint-disable @typescript-eslint/no-explicit-any */
import { BytesPipe } from './bytes.pipe';

describe('BytesPipe', () => {
  let pipe: BytesPipe;

  beforeEach(() => {
    pipe = new BytesPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Basic conversions', () => {
    it('should return 0 B for 0', () => {
      expect(pipe.transform(0)).toBe('0 B');
    });

    it('should return 1 KB for 1024', () => {
      expect(pipe.transform(1024)).toBe('1.00 KB');
    });

    it('should return 1 MB for 1024^2', () => {
      expect(pipe.transform(1048576)).toBe('1.00 MB');
    });

    it('should return 1.50 KB for 1536', () => {
      expect(pipe.transform(1536)).toBe('1.50 KB');
    });
  });

  describe('Decimals', () => {
    it('should use default decimals (2)', () => {
      expect(pipe.transform(1500)).toBe('1.46 KB');
    });

    it('should use provided decimals', () => {
      expect(pipe.transform(1500, 0)).toBe('1 KB');
      expect(pipe.transform(1500, 1)).toBe('1.5 KB');
      expect(pipe.transform(1500, 3)).toBe('1.465 KB');
    });

    it('should ignore decimals if negative', () => {
      expect(pipe.transform(1500, -1)).toBe('1.46484375 KB');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(pipe.transform('')).toBe('0 B');
    });

    it('should handle NaN', () => {
      expect(pipe.transform('abc')).toBe('0 B');
    });

    it('should handle null/undefined', () => {
      expect(pipe.transform(null as any)).toBe('0 B');
      expect(pipe.transform(undefined as any)).toBe('0 B');
    });

    it('should handle negative numbers', () => {
      expect(pipe.transform(-1024)).toBe('-1.00 KB');
    });

    it('should handle string inputs', () => {
      expect(pipe.transform('1024')).toBe('1.00 KB');
    });

    it('should handle very large numbers (PB)', () => {
      const pb = Math.pow(1024, 5);
      expect(pipe.transform(pb)).toBe('1.00 PB');
    });

    it('should handle numbers larger than max unit (cap at PB)', () => {
      const huge = Math.pow(1024, 6);
      expect(pipe.transform(huge)).toBe('1024.00 PB');
    });
  });

  describe('Custom units', () => {
    it('should use custom units when provided', () => {
      const customUnits = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];
      expect(pipe.transform(1024, 2, customUnits)).toBe('1.00 kb');
    });

    it('should use custom units for 0', () => {
      const customUnits = ['Bytes', 'Kilobytes', 'Megabytes'];
      expect(pipe.transform(0, 2, customUnits)).toBe('0 Bytes');
    });

    it('should use custom units for negative numbers', () => {
      const customUnits = ['b', 'kb', 'mb'];
      expect(pipe.transform(-1024, 2, customUnits)).toBe('-1.00 kb');
    });

    it('should handle custom units with fewer elements', () => {
      const shortUnits = ['B', 'KB']; // Max is KB
      const mbValue = 1024 * 1024;
      expect(pipe.transform(mbValue, 2, shortUnits)).toBe('1024.00 KB');
    });
  });

  describe('SI units (base 1000)', () => {
    it('should use SI base (1000) when useSI is true', () => {
      expect(pipe.transform(1000, 2, null, true)).toBe('1.00 KB');
      expect(pipe.transform(1000000, 2, null, true)).toBe('1.00 MB');
      expect(pipe.transform(1000000000, 2, null, true)).toBe('1.00 GB');
    });

    it('should use binary base (1024) when useSI is false (default)', () => {
      expect(pipe.transform(1024, 2, null, false)).toBe('1.00 KB');
      expect(pipe.transform(1000, 2, null, false)).toBe('1000.00 B');
    });

    it('should handle SI with custom decimals', () => {
      expect(pipe.transform(1500, 0, null, true)).toBe('2 KB');
      expect(pipe.transform(1500, 3, null, true)).toBe('1.500 KB');
    });

    it('should handle SI with custom units', () => {
      const customUnits = ['b', 'kb', 'mb'];
      expect(pipe.transform(1000, 2, customUnits, true)).toBe('1.00 kb');
    });

    it('should handle SI with negative numbers', () => {
      expect(pipe.transform(-1000, 2, null, true)).toBe('-1.00 KB');
    });

    it('should handle very large SI numbers', () => {
      const pb = Math.pow(1000, 5);
      expect(pipe.transform(pb, 2, null, true)).toBe('1.00 PB');
    });
  });
});
