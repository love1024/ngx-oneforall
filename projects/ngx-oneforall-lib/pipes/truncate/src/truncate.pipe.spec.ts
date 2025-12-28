import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return the original string if shorter than limit', () => {
    expect(pipe.transform('short', 10)).toBe('short');
  });

  it('should truncate and add ellipsis if longer than limit', () => {
    expect(pipe.transform('This is a long string', 7)).toBe('This is…');
  });

  it('should truncate at whole words if completeWords is true', () => {
    expect(pipe.transform('This is a long string', 10, true)).toBe(
      'This is a…'
    );
  });

  it('should use custom ellipsis', () => {
    expect(pipe.transform('This is a long string', 7, false, '***')).toBe(
      'This is***'
    );
  });

  it('should handle no spaces when completeWords is true', () => {
    expect(pipe.transform('Supercalifragilistic', 5, true)).toBe('…');
  });

  it('should handle lastSpace at position 0', () => {
    expect(pipe.transform(' Super', 3, true)).toBe('…');
  });

  it('should handle limit of 0', () => {
    expect(pipe.transform('Test', 0)).toBe('…');
  });
});
