import { hashCode, hashCodeWithSalt } from './hash';

describe('hashCode', () => {
  it('should return a consistent hash code for the same string', () => {
    const str = 'test';
    const result1 = hashCode(str);
    const result2 = hashCode(str);

    expect(result1).toBe(result2);
  });

  it('should return different hash codes for different strings', () => {
    const str1 = 'test1';
    const str2 = 'test2';

    const result1 = hashCode(str1);
    const result2 = hashCode(str2);

    expect(result1).not.toBe(result2);
  });

  it('should handle an empty string', () => {
    const result = hashCode('');
    expect(result).toBe(0);
  });
});

describe('hashCodeWithSalt', () => {
  it('should return a consistent hash code for the same string and salt', () => {
    const str = 'test';
    const salt = 'salt';

    const result1 = hashCodeWithSalt(str, salt);
    const result2 = hashCodeWithSalt(str, salt);

    expect(result1).toBe(result2);
  });

  it('should return different hash codes for the same string with different salts', () => {
    const str = 'test';
    const salt1 = 'salt1';
    const salt2 = 'salt2';

    const result1 = hashCodeWithSalt(str, salt1);
    const result2 = hashCodeWithSalt(str, salt2);

    expect(result1).not.toBe(result2);
  });

  it('should return different hash codes for different strings with the same salt', () => {
    const str1 = 'test1';
    const str2 = 'test2';
    const salt = 'salt';

    const result1 = hashCodeWithSalt(str1, salt);
    const result2 = hashCodeWithSalt(str2, salt);

    expect(result1).not.toBe(result2);
  });

  it('should handle an empty string and salt', () => {
    const result = hashCodeWithSalt('', '');
    expect(result).toBe(0);
  });
});
