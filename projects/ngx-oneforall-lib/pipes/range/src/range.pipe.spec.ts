import { RangePipe } from './range.pipe';

describe('RangePipe', () => {
  let pipe: RangePipe;

  beforeEach(() => {
    pipe = new RangePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Single argument (end only)', () => {
    it('should generate range from 0 to end', () => {
      expect(pipe.transform(5)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return empty array for 0', () => {
      expect(pipe.transform(0)).toEqual([]);
    });

    it('should handle negative end (descending from 0)', () => {
      expect(pipe.transform(-3)).toEqual([0, -1, -2]);
    });
  });

  describe('Two arguments (start, end)', () => {
    it('should generate ascending range', () => {
      expect(pipe.transform(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('should generate descending range', () => {
      expect(pipe.transform(5, 1)).toEqual([5, 4, 3, 2]);
    });

    it('should return empty array when start equals end', () => {
      expect(pipe.transform(5, 5)).toEqual([]);
    });

    it('should handle negative ranges', () => {
      expect(pipe.transform(-3, 3)).toEqual([-3, -2, -1, 0, 1, 2]);
    });
  });

  describe('With step', () => {
    it('should use custom step for ascending range', () => {
      expect(pipe.transform(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('should use custom step for descending range', () => {
      expect(pipe.transform(10, 0, 2)).toEqual([10, 8, 6, 4, 2]);
    });

    it('should handle decimal step', () => {
      expect(pipe.transform(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
    });

    it('should auto-correct negative step to positive', () => {
      expect(pipe.transform(0, 5, -1)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should treat zero step as 1', () => {
      expect(pipe.transform(0, 3, 0)).toEqual([0, 1, 2]);
    });
  });

  describe('Edge cases', () => {
    it('should handle large ranges', () => {
      const result = pipe.transform(0, 100);
      expect(result.length).toBe(100);
      expect(result[0]).toBe(0);
      expect(result[99]).toBe(99);
    });

    it('should handle step larger than range', () => {
      expect(pipe.transform(0, 3, 5)).toEqual([0]);
    });

    it('should handle descending with step larger than range', () => {
      expect(pipe.transform(3, 0, 5)).toEqual([3]);
    });
  });
});
