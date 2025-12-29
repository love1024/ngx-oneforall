import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OnlyInBrowser } from './only-in-browser';
import * as platformContext from './platform-context';

@Component({
  template: `<div></div>`,
})
class TestComponent {
  called = false;

  @OnlyInBrowser()
  browserMethod() {
    this.called = true;
    return 'browser';
  }

  @OnlyInBrowser({ fallback: 'fallback-value' })
  methodWithFallback() {
    this.called = true;
    return 'browser';
  }

  @OnlyInBrowser({ fallback: [] })
  methodWithArrayFallback(): string[] {
    this.called = true;
    return ['browser'];
  }

  @OnlyInBrowser({ fallback: of('observable-fallback') })
  methodWithObservableFallback() {
    this.called = true;
    return of('browser');
  }

  @OnlyInBrowser({ fallback: Promise.resolve('promise-fallback') })
  methodWithPromiseFallback() {
    this.called = true;
    return Promise.resolve('browser');
  }
}

describe('OnlyInBrowser Decorator', () => {
  describe('In Browser', () => {
    let component: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      });
      component = TestBed.createComponent(TestComponent).componentInstance;
    });

    it('should call the method in browser platform', () => {
      const result = component.browserMethod();
      expect(component.called).toBe(true);
      expect(result).toBe('browser');
    });

    it('should call the method with fallback in browser platform', () => {
      const result = component.methodWithFallback();
      expect(component.called).toBe(true);
      expect(result).toBe('browser');
    });
  });

  describe('Not Browser', () => {
    let component: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      });
      component = TestBed.createComponent(TestComponent).componentInstance;
      jest
        .spyOn(platformContext, 'getCurrentPlatformId')
        .mockReturnValue(undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should not call the method in non-browser platform', () => {
      const result = component.browserMethod();
      expect(component.called).toBe(false);
      expect(result).toBeUndefined();
    });

    it('should return fallback value when not in browser', () => {
      const result = component.methodWithFallback();
      expect(component.called).toBe(false);
      expect(result).toBe('fallback-value');
    });

    it('should return array fallback when not in browser', () => {
      const result = component.methodWithArrayFallback();
      expect(component.called).toBe(false);
      expect(result).toEqual([]);
    });

    it('should return Observable fallback when not in browser', done => {
      const result = component.methodWithObservableFallback();
      expect(component.called).toBe(false);
      result.subscribe({
        next: (value: string) => {
          expect(value).toBe('observable-fallback');
          done();
        },
      });
    });

    it('should return Promise fallback when not in browser', async () => {
      const result = component.methodWithPromiseFallback();
      expect(component.called).toBe(false);
      const value = await result;
      expect(value).toBe('promise-fallback');
    });
  });
});
