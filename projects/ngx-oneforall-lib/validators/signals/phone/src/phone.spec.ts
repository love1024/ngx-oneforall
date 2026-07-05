import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { phone } from './phone';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: '2133734253' }), path => {
    phone(path.val, 'US');
  });
}

describe('phone signal validator', () => {
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

  it('should return null for valid phone numbers', () => {
    component.testForm.val().value.set('2133734253');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for invalid phone numbers', () => {
    component.testForm.val().value.set('123');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'phone', message: 'invalid_format' },
    ]);
  });

  it('should allow custom message as string', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: '123' }), path => {
        phone(path.val, 'US', { message: 'Invalid phone' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'phone', message: 'Invalid phone' },
      ]);
    });
  });

  it('should allow custom message as Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: '123' }), path => {
        phone(path.val, 'US', {
          message: { invalid_format: 'Custom format error' },
        });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'phone', message: 'Custom format error' },
      ]);
    });
  });
});
