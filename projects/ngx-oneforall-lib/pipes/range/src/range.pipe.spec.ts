import { RangePipe } from './range.pipe';

describe('RangePipe', () => {
  let pipe: RangePipe;

  beforeEach(() => {
    pipe = new RangePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Single argument', () => {
    it('should generate range from 0 to end', () => {
      expect(pipe.transform(5)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return empty array for 0', () => {
      expect(pipe.transform(0)).toEqual([]);
    });

    it('should handle negative single argument (0 to -5)', () => {
      expect(pipe.transform(-5)).toEqual([0, -1, -2, -3, -4]);
    });
  });

  describe('Two arguments', () => {
    it('should generate range from start to end', () => {
      expect(pipe.transform(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('should handle decreasing range', () => {
      expect(pipe.transform(5, 1)).toEqual([5, 4, 3, 2]);
    });

    it('should return empty array if start equals end', () => {
      expect(pipe.transform(5, 5)).toEqual([]);
    });
  });

  describe('With step', () => {
    it('should use custom step', () => {
      expect(pipe.transform(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('should use custom step for decreasing range', () => {
      expect(pipe.transform(10, 0, 2)).toEqual([10, 8, 6, 4, 2]);
    });

    it('should handle step that does not divide evenly', () => {
      expect(pipe.transform(0, 10, 3)).toEqual([0, 3, 6, 9]);
    });
  });

  describe('Edge cases', () => {
    it('should treat step 0 as 1', () => {
      expect(pipe.transform(0, 5, 0)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should treat negative step as positive (direction determined by start/end)', () => {
      expect(pipe.transform(0, 5, -1)).toEqual([0, 1, 2, 3, 4]);
      expect(pipe.transform(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
    });

    it('should handle float steps', () => {
      // Floating point arithmetic can be tricky, checking approximate behavior or simple cases
      // 0, 0.5, 1.0, 1.5
      expect(pipe.transform(0, 2, 0.5)).toEqual([0, 0.5, 1, 1.5]);
    });
  });
});
