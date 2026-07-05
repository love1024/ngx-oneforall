import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { date } from './date';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: '2020-01-01' }), path => {
    date(path.val);
  });
}

describe('date signal validator', () => {
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

  it('should return null for valid dates', () => {
    component.testForm.val().value.set('2020-01-01');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for invalid date', () => {
    component.testForm.val().value.set('invalid-date');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'date', message: 'invalid_date' },
    ]);
  });

  it('should return error for unsupported type', () => {
    component.testForm.val().value.set({} as never);
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'date', message: 'unsupported_type' },
    ]);
  });

  it('should allow custom message as a string', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'invalid' }), path => {
        date(path.val, { message: 'Custom date error' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'date', message: 'Custom date error' },
      ]);
    });
  });

  it('should allow custom message as a Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'invalid' }), path => {
        date(path.val, {
          message: { invalid_date: 'Custom invalid date error' },
        });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'date', message: 'Custom invalid date error' },
      ]);
    });
  });
});
