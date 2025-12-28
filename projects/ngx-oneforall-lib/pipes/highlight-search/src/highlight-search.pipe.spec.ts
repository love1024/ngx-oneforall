import { HighlightSearchPipe } from './highlight-search.pipe';

describe('HighlightSearchPipe', () => {
  let pipe: HighlightSearchPipe;

  beforeEach(() => {
    pipe = new HighlightSearchPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should highlight search term', () => {
    expect(pipe.transform('Hello World', 'World')).toBe('Hello <mark>World</mark>');
  });

  it('should be case insensitive', () => {
    expect(pipe.transform('Hello World', 'world')).toBe('Hello <mark>World</mark>');
  });

  it('should highlight multiple occurrences', () => {
    expect(pipe.transform('Hello World, Hello Universe', 'Hello')).toBe('<mark>Hello</mark> World, <mark>Hello</mark> Universe');
  });

  it('should handle special regex characters', () => {
    expect(pipe.transform('Price is $100', '$100')).toBe('Price is <mark>$100</mark>');
    expect(pipe.transform('1 + 1 = 2', '+')).toBe('1 <mark>+</mark> 1 = 2');
  });

  it('should return original value if search term is empty', () => {
    expect(pipe.transform('Hello World', '')).toBe('Hello World');
    expect(pipe.transform('Hello World', null)).toBe('Hello World');
    expect(pipe.transform('Hello World', undefined)).toBe('Hello World');
  });

  it('should return empty string if value is null/undefined', () => {
    expect(pipe.transform(null, 'search')).toBe('');
    expect(pipe.transform(undefined, 'search')).toBe('');
  });
});
