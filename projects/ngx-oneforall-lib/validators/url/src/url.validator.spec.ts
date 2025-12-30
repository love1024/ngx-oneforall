import { FormControl } from '@angular/forms';
import { url } from './url.validator';

describe('url', () => {
  it('should validate absolute URLs', () => {
    const validator = url();
    expect(validator(new FormControl('https://google.com'))).toBeNull();
    expect(validator(new FormControl('http://google.com/path'))).toBeNull();
    expect(validator(new FormControl('ftp://files.com'))).toBeNull();
  });

  it('should invalidate invalid URLs', () => {
    const validator = url();
    expect(validator(new FormControl('invalid-url'))).toEqual({
      url: { reason: 'invalid_format', actualValue: 'invalid-url' },
    });
    expect(validator(new FormControl('www.google.com'))).toEqual({
      url: { reason: 'invalid_format', actualValue: 'www.google.com' },
    }); // Missing protocol makes it relative/invalid for strict
  });

  it('should allow URLs missing protocol if skipProtocol is true', () => {
    const validator = url({ skipProtocol: true });
    expect(validator(new FormControl('google.com'))).toBeNull();
    expect(validator(new FormControl('www.google.com/path'))).toBeNull();

    // Should still validate normal URLs
    expect(validator(new FormControl('https://google.com'))).toBeNull();
    // Should still fail invalid stuff
    expect(validator(new FormControl('invalid url'))).toBeTruthy();
  });

  it('should invalidate non-string values', () => {
    const validator = url();
    expect(validator(new FormControl(123))).toEqual({
      url: { reason: 'unsupported_type', actualValue: 123 },
    });
    expect(validator(new FormControl({}))).toEqual({
      url: { reason: 'unsupported_type', actualValue: {} },
    });
    expect(validator(new FormControl(true))).toEqual({
      url: { reason: 'unsupported_type', actualValue: true },
    });
  });

  it('should restrict protocols', () => {
    const validator = url({ protocols: ['https'] });
    expect(validator(new FormControl('https://google.com'))).toBeNull();

    expect(validator(new FormControl('http://google.com'))).toEqual({
      url: {
        reason: 'invalid_protocol',
        protocols: ['https'],
        actualProtocol: 'http',
      },
    });
  });
});
