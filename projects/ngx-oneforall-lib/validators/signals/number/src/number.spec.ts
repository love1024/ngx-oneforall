import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { number } from './number';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal<{ val: string | number }>({ val: '123' }), path => {
    number(path.val);
  });
}

describe('number signal validator', () => {
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

  it('should return null for valid numbers', () => {
    component.testForm.val().value.set(123);
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);

    component.testForm.val().value.set('456');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for invalid numbers', () => {
    component.testForm.val().value.set('abc');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'number', message: 'number' },
    ]);
  });

  it('should allow custom message', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(
        signal<{ val: string | number }>({ val: 'abc' }),
        path => {
          number(path.val, { message: 'Not a valid number' });
        }
      );
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'number', message: 'Not a valid number' },
      ]);
    });
  });
});
