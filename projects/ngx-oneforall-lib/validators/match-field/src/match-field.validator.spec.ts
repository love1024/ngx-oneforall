import { FormControl, FormGroup } from '@angular/forms';
import { matchFields } from './match-field.validator';

describe('matchFields Validator (Group-Level)', () => {
  it('should return null when values match', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test123'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();
  });

  it('should return error when values do not match', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
        confirmPassword: new FormControl('different'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'test123',
        field2: 'confirmPassword',
        field2Value: 'different',
      },
    });
  });

  it('should return null when both fields are empty', () => {
    const form = new FormGroup(
      {
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();
  });

  it('should return null when both fields are null', () => {
    const form = new FormGroup(
      {
        password: new FormControl(null),
        confirmPassword: new FormControl(null),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();
  });

  it('should return null if first field does not exist', () => {
    const form = new FormGroup(
      {
        confirmPassword: new FormControl('test123'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();
  });

  it('should return null if second field does not exist', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();
  });

  it('should detect error when first field changes after matching', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test123'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();

    form.get('password')?.setValue('changed');
    form.updateValueAndValidity();

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'changed',
        field2: 'confirmPassword',
        field2Value: 'test123',
      },
    });
  });

  it('should detect error when second field changes after matching', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test123'),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toBeNull();

    form.get('confirmPassword')?.setValue('changed');
    form.updateValueAndValidity();

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'test123',
        field2: 'confirmPassword',
        field2Value: 'changed',
      },
    });
  });

  it('should return error when only one field has value', () => {
    const form = new FormGroup(
      {
        password: new FormControl('test123'),
        confirmPassword: new FormControl(''),
      },
      { validators: matchFields('password', 'confirmPassword') }
    );

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'test123',
        field2: 'confirmPassword',
        field2Value: '',
      },
    });
  });
});
