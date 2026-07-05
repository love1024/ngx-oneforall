import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { notBlank } from './not-blank';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: '' }), path => {
    notBlank(path.val);
  });
}

describe('notBlank signal validator', () => {
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

  it('should return empty array for valid non-blank strings', () => {
    component.testForm.val().value.set('hello');
    fixture.detectChanges();
    expect(component.testForm.val().valid()).toBe(true);
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for empty string', () => {
    component.testForm.val().value.set('');
    fixture.detectChanges();
    expect(component.testForm.val().valid()).toBe(false);
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'notBlank', message: 'notBlank' },
    ]);
  });

  it('should return error for whitespace-only strings', () => {
    component.testForm.val().value.set('   ');
    fixture.detectChanges();
    expect(component.testForm.val().valid()).toBe(false);
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'notBlank', message: 'notBlank' },
    ]);
  });

  it('should allow custom message', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: '   ' }), path => {
        notBlank(path.val, { message: 'Custom blank error' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'notBlank', message: 'Custom blank error' },
      ]);
    });
  });
});
