import { FormControl } from '@angular/forms';
import { date } from './date.validator';

describe('date', () => {
  it('should be valid for null/undefined/empty string', () => {
    const validator = date;
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl('   '))).toBeNull();
  });

  it('should be valid for Date objects', () => {
    const validator = date;
    expect(validator(new FormControl(new Date()))).toBeNull();
    expect(validator(new FormControl(new Date('2023-01-01')))).toBeNull();
  });

  it('should invalidate Invalid Date objects', () => {
    const validator = date;
    const invalidDate = new Date('invalid');
    expect(validator(new FormControl(invalidDate))).toEqual({
      date: { reason: 'invalid_date', actualValue: invalidDate },
    });
  });

  it('should validate valid date strings', () => {
    const validator = date;
    expect(validator(new FormControl('2023-01-01'))).toBeNull();
    expect(validator(new FormControl('Jan 1, 2023'))).toBeNull();
  });

  it('should invalidate invalid date strings', () => {
    const validator = date;
    expect(validator(new FormControl('invalid date'))).toEqual({
      date: { reason: 'invalid_date', actualValue: 'invalid date' },
    });
    expect(validator(new FormControl('not a date'))).toEqual({
      date: { reason: 'invalid_date', actualValue: 'not a date' },
    });
  });

  it('should validate numeric timestamps', () => {
    const validator = date;
    expect(validator(new FormControl(1704067200000))).toBeNull(); // Valid timestamp
    expect(validator(new FormControl(Date.now()))).toBeNull();
  });

  it('should invalidate invalid numeric timestamps', () => {
    const validator = date;
    expect(validator(new FormControl(NaN))).toEqual({
      date: { reason: 'invalid_date', actualValue: NaN },
    });
    expect(validator(new FormControl(Infinity))).toEqual({
      date: { reason: 'invalid_date', actualValue: Infinity },
    });
  });

  it('should invalidate non-date types', () => {
    const validator = date;
    expect(validator(new FormControl(true))).toEqual({
      date: { reason: 'unsupported_type', actualValue: true },
    });
    expect(validator(new FormControl({}))).toEqual({
      date: { reason: 'unsupported_type', actualValue: {} },
    });
  });
});
