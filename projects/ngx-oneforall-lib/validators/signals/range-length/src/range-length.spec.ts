import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { rangeLength } from './range-length';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: 'abc' }), path => {
    rangeLength(path.val, 2, 5);
  });
}

describe('rangeLength signal validator', () => {
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

  it('should return null for lengths in range', () => {
    component.testForm.val().value.set('abc');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for lengths out of range', () => {
    component.testForm.val().value.set('a');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'rangeLength', message: 'length_out_of_range' },
    ]);
  });

  it('should allow custom message as string', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'a' }), path => {
        rangeLength(path.val, 2, 5, { message: 'Out of custom range' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'rangeLength', message: 'Out of custom range' },
      ]);
    });
  });

  it('should allow custom message as Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'a' }), path => {
        rangeLength(path.val, 2, 5, {
          message: { length_out_of_range: 'Custom length_out_of_range error' },
        });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'rangeLength', message: 'Custom length_out_of_range error' },
      ]);
    });
  });
});
