import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { matchFields } from './match-field';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ group: { pass: '', confirm: '' } }), path => {
    matchFields(path.group, 'pass', 'confirm');
  });
}

describe('matchFields signal validator', () => {
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

  it('should return null if both are empty', () => {
    component.testForm.group().value.set({ pass: '', confirm: '' });
    fixture.detectChanges();
    expect(component.testForm.group().valid()).toBe(true);
    expect(component.testForm.group().errors()).toEqual([]);
  });

  it('should return null if both are null', () => {
    component.testForm
      .group()
      .value.set({ pass: null, confirm: null } as never);
    fixture.detectChanges();
    expect(component.testForm.group().valid()).toBe(true);
  });

  it('should return null if fields match', () => {
    component.testForm.group().value.set({ pass: '123', confirm: '123' });
    fixture.detectChanges();
    expect(component.testForm.group().valid()).toBe(true);
  });

  it('should return error if fields do not match', () => {
    component.testForm.group().value.set({ pass: '123', confirm: '456' });
    fixture.detectChanges();
    expect(component.testForm.group().valid()).toBe(false);
    expect(component.testForm.group().errors()).toMatchObject([
      { kind: 'matchFields', message: 'matchFields' },
    ]);
  });

  it('should handle null group value', () => {
    component.testForm.group().value.set(null as never);
    fixture.detectChanges();
    expect(component.testForm.group().valid()).toBe(true);
  });

  it('should allow custom message', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(
        signal({ group: { pass: '123', confirm: '456' } }),
        path => {
          matchFields(path.group, 'pass', 'confirm', {
            message: 'Passwords do not match',
          });
        }
      );
      expect(customForm.group().errors()).toMatchObject([
        { kind: 'matchFields', message: 'Passwords do not match' },
      ]);
    });
  });
});
