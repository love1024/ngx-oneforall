import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { range } from './range';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: 5 }), path => {
    range(path.val, 1, 10);
  });
}

describe('range signal validator', () => {
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

  it('should return null for numbers in range', () => {
    component.testForm.val().value.set(5);
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for numbers out of range', () => {
    component.testForm.val().value.set(15);
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'range', message: 'out_of_range' },
    ]);
  });

  it('should allow custom message as string', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 15 }), path => {
        range(path.val, 1, 10, { message: 'Out of custom range' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'range', message: 'Out of custom range' },
      ]);
    });
  });

  it('should allow custom message as Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 15 }), path => {
        range(path.val, 1, 10, {
          message: { out_of_range: 'Custom out_of_range error' },
        });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'range', message: 'Custom out_of_range error' },
      ]);
    });
  });
});
