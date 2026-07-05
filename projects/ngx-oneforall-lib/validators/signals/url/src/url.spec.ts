import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { url } from './url';

import { signal } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
class TestComponent {
  testForm = form(signal({ val: 'https://google.com' }), path => {
    url(path.val);
  });
}

describe('url signal validator', () => {
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

  it('should return null for valid URLs', () => {
    component.testForm.val().value.set('https://google.com');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toEqual([]);
  });

  it('should return error for invalid format', () => {
    component.testForm.val().value.set('google.com');
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'url', message: 'invalid_format' },
    ]);
  });

  it('should return error for unsupported type', () => {
    component.testForm.val().value.set(123 as never);
    fixture.detectChanges();
    expect(component.testForm.val().errors()).toMatchObject([
      { kind: 'url', message: 'unsupported_type' },
    ]);
  });

  it('should return error for invalid protocol', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'ftp://google.com' }), path => {
        url(path.val, { protocols: ['http', 'https'] });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'url', message: 'invalid_protocol' },
      ]);
    });
  });

  it('should return null for valid domain without protocol when skipProtocol is true', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'google.com' }), path => {
        url(path.val, { skipProtocol: true });
      });
      expect(customForm.val().errors()).toEqual([]);
    });
  });

  it('should allow custom message as string', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'google' }), path => {
        url(path.val, { message: 'Custom invalid format' });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'url', message: 'Custom invalid format' },
      ]);
    });
  });

  it('should allow custom message as Record', () => {
    TestBed.runInInjectionContext(() => {
      const customForm = form(signal({ val: 'google' }), path => {
        url(path.val, { message: { invalid_format: 'Custom format error' } });
      });
      expect(customForm.val().errors()).toMatchObject([
        { kind: 'url', message: 'Custom format error' },
      ]);
    });
  });
});
