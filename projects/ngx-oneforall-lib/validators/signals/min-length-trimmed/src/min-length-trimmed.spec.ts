import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { minLengthTrimmed } from './min-length-trimmed';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: '  abc  ' }), path => {
    minLengthTrimmed(path.val, 3);
  });
}

describe('minLengthTrimmed signal validator', () => {
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

  it('should return null for valid length', () => {
    component.testForm.val().value.set('   123   ');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for invalid length', () => {
    component.testForm.val().value.set('  12  ');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'minLengthTrimmed', message: 'minLengthTrimmed' },
    ]);
  });

  it('should allow custom message', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: '12' }), path => {
        minLengthTrimmed(path.val, 3, { message: 'Too short' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'minLengthTrimmed', message: 'Too short' },
      ]);
    });
  });
});
