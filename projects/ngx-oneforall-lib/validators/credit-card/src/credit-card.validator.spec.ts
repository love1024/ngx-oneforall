import { FormControl } from '@angular/forms';
import { creditCard } from './credit-card.validator';

describe('creditCard', () => {
  it('should be valid for null/undefined/empty string', () => {
    expect(creditCard(new FormControl(null))).toBeNull();
    expect(creditCard(new FormControl(undefined))).toBeNull();
    expect(creditCard(new FormControl(''))).toBeNull();
  });

  it('should validate valid credit card numbers (Luhn check)', () => {
    // Valid Visa (16 digit)
    expect(creditCard(new FormControl('4539148803436574'))).toBeNull();
    // Valid Mastercard (16 digit)
    expect(creditCard(new FormControl('5105105105105100'))).toBeNull();
    // Valid Amex (15 digit, starts with 34 or 37)
    expect(creditCard(new FormControl('378282246310005'))).toBeNull();
  });

  it('should validate valid credit card numbers with separators', () => {
    expect(creditCard(new FormControl('4539-1488-0343-6574'))).toBeNull();
    expect(creditCard(new FormControl('4539 1488 0343 6574'))).toBeNull();
  });

  it('should invalidate invalid credit card numbers', () => {
    // Just random digits (Luhn fail)
    expect(creditCard(new FormControl('1234567812345678'))).toEqual({
      creditCard: { reason: 'luhn_failed' },
    });
    // Almost valid but last digit off
    expect(creditCard(new FormControl('4539148803436577'))).toEqual({
      creditCard: { reason: 'luhn_failed' },
    });
  });

  it('should invalidate incorrect allowed lengths', () => {
    // 12 digits (not allowed)
    expect(creditCard(new FormControl('453914880343'))).toEqual({
      creditCard: { reason: 'invalid_length', actualLength: 12 },
    });
    // 14 digits (not allowed)
    expect(creditCard(new FormControl('45391488034365'))).toEqual({
      creditCard: { reason: 'invalid_length', actualLength: 14 },
    });
    // 17 digits (not allowed)
    expect(creditCard(new FormControl('45391488034365777'))).toEqual({
      creditCard: { reason: 'invalid_length', actualLength: 17 },
    });
    // 18 digits (not allowed)
    expect(creditCard(new FormControl('453914880343657777'))).toEqual({
      creditCard: { reason: 'invalid_length', actualLength: 18 },
    });
  });

  it('should enforce Amex logic for 15-digit cards', () => {
    // 15 digit, does NOT start with 34/37 (e.g. starts with 4) -> Invalid
    expect(creditCard(new FormControl('453914880343657'))).toEqual({
      creditCard: { reason: 'invalid_amex_prefix' },
    });
  });

  it('should invalidate non-numeric characters that result in empty or invalid check', () => {
    // 'abc' -> numeric strip -> empty string -> length check fail
    expect(creditCard(new FormControl('abc'))).toEqual({
      creditCard: { reason: 'invalid_length', actualLength: 0 },
    });
  });

  it('should invalidate repeated digits (e.g. 0000...)', () => {
    expect(creditCard(new FormControl('0000000000000000'))).toEqual({
      creditCard: { reason: 'repeated_digits' },
    });
    expect(creditCard(new FormControl('1111111111111111'))).toEqual({
      creditCard: { reason: 'repeated_digits' },
    });
  });
});
