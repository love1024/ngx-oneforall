import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { creditCard } from './credit-card';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: '' }), path => {
    creditCard(path.val);
  });
}

describe('creditCard signal validator', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return null for empty values', () => {
    component.testForm.val().value.set('');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return null for valid 16-digit PAN (Luhn check)', () => {
    component.testForm.val().value.set('4111 1111 1111 1111');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return null for valid 15-digit Amex PAN', () => {
    component.testForm.val().value.set('378282246310005'); // valid test Amex PAN
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for repeated digits', () => {
    component.testForm.val().value.set('1111111111111111');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      {
        kind: 'creditCard',
        message: 'repeated_digits',
      },
    ]);
  });

  it('should return error for invalid length', () => {
    component.testForm.val().value.set('4111 1111 1111 11'); // 14 digits
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      {
        kind: 'creditCard',
        message: 'invalid_length',
      },
    ]);
  });

  it('should return error for invalid Amex prefix (15 digits)', () => {
    component.testForm.val().value.set('4111 1111 1111 111'); // 15 digits but starts with 4
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      {
        kind: 'creditCard',
        message: 'invalid_amex_prefix',
      },
    ]);
  });

  it('should return error for Luhn failure', () => {
    component.testForm.val().value.set('4111 1111 1111 1112'); // Fails Luhn checksum
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      {
        kind: 'creditCard',
        message: 'luhn_failed',
      },
    ]);
  });

  it('should return null for valid credit card (Luhn check passed)', () => {
    component.testForm.val().value.set('4111 1111 1111 1111');
    fixture.detectChanges();
    expect(component.testForm.val().valid()).toBe(true);
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should allow custom message as a string', () => {
    TestBed.runInInjectionContext(() => {
      // 14 digits triggers 'invalid_length'
      const customForm = form(signal({ val: '4111 1111 1111 11' }), path => {
        creditCard(path.val, { message: 'Custom global CC error' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'creditCard', message: 'Custom global CC error' },
      ]);
    });
  });

  it('should allow custom message as a Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: '4111 1111 1111 11' }), path => {
        creditCard(path.val, {
          message: {
            invalid_length: 'Custom invalid length error',
          },
        });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'creditCard', message: 'Custom invalid length error' },
      ]);
    });
  });
});
