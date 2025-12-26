import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BREAKPOINT } from '@ngx-oneforall/constants';
import {
  breakpointMatcher,
  breakpointMatcherMultiple,
} from './breakpoint-matcher';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'test-breakpoint',
  template: `<div>{{ isMd$() }}</div>`,
})
class TestBreakpointComponent {
  isMd$ = breakpointMatcher(BREAKPOINT.MD);
}

@Component({
  selector: 'test-multiple-breakpoints',
  template: `<div>{{ result$().some }}-{{ result$().all }}</div>`,
})
class TestMultipleBreakpointsComponent {
  result$ = breakpointMatcherMultiple([BREAKPOINT.MD, BREAKPOINT.LG]);
}

@Component({
  selector: 'test-custom-breakpoints',
  template: `<div>{{ result$().some }}-{{ result$().all }}</div>`,
})
class TestCustomMultipleBreakpointsComponent {
  result$ = breakpointMatcherMultiple([
    '(min-width: 500px)',
    '(max-width: 1000px)',
  ]);
}

describe('breakpointMatcher', () => {
  let fixture: ComponentFixture<TestBreakpointComponent>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    TestBed.configureTestingModule({
      imports: [TestBreakpointComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.restoreAllMocks();
  });

  it('should display true when media query matches', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    fixture = TestBed.createComponent(TestBreakpointComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true');
  });

  it('should display false when media query does not match', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    fixture = TestBed.createComponent(TestBreakpointComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false');
  });

  it('should update view when media query changes', () => {
    let handler: (event: { matches: boolean }) => void;
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: (
        event: string,
        cb: (event: { matches: boolean }) => void
      ) => {
        if (event === 'change') handler = cb;
      },
      removeEventListener: jest.fn(),
    });

    fixture = TestBed.createComponent(TestBreakpointComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false');

    // Simulate media query change
    handler!({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true');
  });

  it('should handle string queries', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    TestBed.runInInjectionContext(() => {
      const signal = breakpointMatcher('(min-width: 500px)');

      expect(signal()).toEqual(true);
    });
  });

  it('should handle Breakpoint tokens (hits lines 17, 23)', () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      if (query === '(min-width: 768px)') {
        return {
          matches: true,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        };
      }
      return {
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });

    TestBed.runInInjectionContext(() => {
      // BREAKPOINT.MD mapping to query
      const signal = breakpointMatcher(BREAKPOINT.MD);
      expect(signal()).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });
  });
});

describe('breakpointMatcherMultiple', () => {
  let fixture: ComponentFixture<TestMultipleBreakpointsComponent>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    TestBed.configureTestingModule({
      imports: [TestMultipleBreakpointsComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.restoreAllMocks();
  });

  it('should set all/some correctly when all match', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    fixture = TestBed.createComponent(TestMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-true');
  });

  it('should set all/some correctly when none match', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    fixture = TestBed.createComponent(TestMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false-false');
  });

  it('should set all/some correctly when some match', () => {
    let callCount = 0;
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: callCount++ === 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    fixture = TestBed.createComponent(TestMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-false');
  });

  it('should update when a media query changes', () => {
    const handlers: ((event: { matches: boolean }) => void)[] = [];
    const matches = [false, false];
    let count = -1;
    window.matchMedia = jest.fn().mockImplementation(() => {
      const current = ++count;

      return {
        matches: matches[current],
        addEventListener: (
          event: string,
          cb: (event: { matches: boolean }) => void
        ) => {
          if (event === 'change') handlers[current] = cb;
        },
        removeEventListener: jest.fn(),
      };
    });

    fixture = TestBed.createComponent(TestMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false-false');

    // Simulate first breakpoint change
    matches[0] = true;
    handlers[0]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-false');

    // Simulate second breakpoint change
    matches[1] = true;
    handlers[1]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-true');
  });

  it('should use addListener and removeListener if event lisnters are not supported', () => {
    const handlers: ((event: { matches: boolean }) => void)[] = [];
    const matches = [false, false];
    let count = -1;
    window.matchMedia = jest.fn().mockImplementation(() => {
      const current = ++count;

      return {
        matches: matches[current],
        addListener: (cb: (event: { matches: boolean }) => void) => {
          handlers[current] = cb;
        },
        removeListener: jest.fn(),
      };
    });

    fixture = TestBed.createComponent(TestMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false-false');

    // Simulate first breakpoint change
    matches[0] = true;
    handlers[0]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-false');

    // Simulate second breakpoint change
    matches[1] = true;
    handlers[1]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-true');
  });
});

describe('breakpointCustomMultiple', () => {
  let fixture: ComponentFixture<TestCustomMultipleBreakpointsComponent>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    TestBed.configureTestingModule({
      imports: [TestCustomMultipleBreakpointsComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.restoreAllMocks();
  });

  it('should handle string queries', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    TestBed.runInInjectionContext(() => {
      const signal = breakpointMatcherMultiple([
        '(min-width: 500px)',
        '(max-width: 1000px)',
      ]);

      expect(signal().some).toBe(true);
      expect(signal().all).toBe(true);
      expect(Object.keys(signal().breakpoints)).toEqual([
        '(min-width: 500px)',
        '(max-width: 1000px)',
      ]);
    });
  });

  it('should handle Breakpoint tokens in multiple (hits lines 51, 52)', () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(min-width: 768px)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });

    TestBed.runInInjectionContext(() => {
      const signal = breakpointMatcherMultiple([
        BREAKPOINT.MD,
        '(min-width: 1000px)',
      ]);

      expect(signal().breakpoints['md']).toBe(true);
      expect(signal().breakpoints['(min-width: 1000px)']).toBe(false);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });
  });

  it('should update when a media query changes', () => {
    const handlers: ((event: { matches: boolean }) => void)[] = [];
    const matches = [false, false];
    let count = -1;
    window.matchMedia = jest.fn().mockImplementation(() => {
      const current = ++count;

      return {
        matches: matches[current],
        addEventListener: (
          event: string,
          cb: (event: { matches: boolean }) => void
        ) => {
          if (event === 'change') handlers[current] = cb;
        },
        removeEventListener: jest.fn(),
      };
    });

    fixture = TestBed.createComponent(TestCustomMultipleBreakpointsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false-false');

    // Simulate first breakpoint change
    matches[0] = true;
    handlers[0]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-false');

    // Simulate second breakpoint change
    matches[1] = true;
    handlers[1]({ matches: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true-true');
  });
});
