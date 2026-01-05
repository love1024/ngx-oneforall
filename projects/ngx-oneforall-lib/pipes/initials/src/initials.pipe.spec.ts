import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined/empty input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('should extract initials from multi-word string', () => {
    expect(pipe.transform('John Doe')).toBe('JD');
    expect(pipe.transform('John Middle Doe')).toBe('JM'); // Default limit 2
  });

  it('should respect the limit param', () => {
    expect(pipe.transform('John Middle Doe', 3)).toBe('JMD');
    expect(pipe.transform('John Doe', 1)).toBe('J');
  });

  it('should handle single word string', () => {
    expect(pipe.transform('John')).toBe('JO'); // Takes first 2 chars by default
    expect(pipe.transform('John', 1)).toBe('J');
  });

  it('should handle extra whitespace', () => {
    expect(pipe.transform('  John   Doe  ')).toBe('JD');
  });
});
