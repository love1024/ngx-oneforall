import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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
  });

  describe('Not Browser', () => {
    let component: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      });
      component = TestBed.createComponent(TestComponent).componentInstance;
    });

    it('should not call the method in non-browser platform', () => {
      jest
        .spyOn(platformContext, 'getCurrentPlatformId')
        .mockReturnValue(undefined);

      const result = component.browserMethod();
      expect(component.called).toBe(false);
      expect(result).toBeUndefined();
    });
  });
});
