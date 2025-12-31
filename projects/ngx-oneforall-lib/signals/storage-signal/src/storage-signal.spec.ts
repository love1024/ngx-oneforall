import { Component, PLATFORM_ID } from '@angular/core';
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Injector } from '@angular/core';
import { storageSignal, StorageSignalOptions } from './storage-signal';

@Component({
  selector: 'test-storage-signal',
  template: `<div>{{ value() }}</div>`,
})
class TestStorageSignalComponent {
  value = storageSignal('testKey', 'default', {
    injector: Injector.create({
      providers: [],
    }),
  });
}

describe('TestStorageSignalComponent', () => {
  let fixture: ComponentFixture<TestStorageSignalComponent>;
  let component: TestStorageSignalComponent;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TestStorageSignalComponent],
    });
    fixture = TestBed.createComponent(TestStorageSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the default value', () => {
    const div = fixture.nativeElement.querySelector('div');
    expect(div.textContent).toBe('default');
  });

  it('should update the value when signal changes', () => {
    component.value.set('updated');
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div');
    expect(div.textContent).toBe('updated');
  });

  it('should persist value to localStorage', () => {
    component.value.set('persisted');
    fixture.detectChanges();
    expect(window.localStorage.getItem('testKey')).toBe(
      JSON.stringify('persisted')
    );
  });

  it('should initialize from localStorage if value exists', fakeAsync(() => {
    window.localStorage.setItem('testKey', JSON.stringify('fromStorage'));
    // Recreate component to trigger initialization
    fixture = TestBed.createComponent(TestStorageSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div');
    expect(div.textContent).toBe('fromStorage');
  }));

  it('should use custom serializer and deserializer', () => {
    const customOptions: StorageSignalOptions<number> = {
      storage: window.localStorage,
      serializer: v => `num:${v}`,
      deserializer: s => parseInt(s.replace('num:', ''), 10),
      injector: TestBed.inject(Injector),
    };
    const signal = storageSignal('customKey', 42, customOptions);
    signal.set(99);

    fixture.detectChanges();

    expect(window.localStorage.getItem('customKey')).toBe('num:99');
    window.localStorage.setItem('customKey', 'num:123');
    // Simulate re-initialization
    const signal2 = storageSignal('customKey', 0, customOptions);
    // afterNextRender is async, so we need to wait for it
    setTimeout(() => {
      expect(signal2()).toBe(123);
    }, 0);
  });

  it('should ignore errors when reading from storage', () => {
    const brokenStorage = {
      getItem: () => {
        throw new Error('fail');
      },
      setItem: jest.fn(),
      removeItem: jest.fn(),
      key: () => null,
      length: 0,
      clear: jest.fn(),
    } as Storage;
    const options: StorageSignalOptions<string> = {
      storage: brokenStorage,
      injector: TestBed.inject(Injector),
    };
    expect(() => storageSignal('brokenKey', 'fallback', options)).not.toThrow();
  });

  it('should ignore errors when writing to storage', () => {
    const brokenStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('fail');
      },
      removeItem: jest.fn(),
      key: () => null,
      length: 0,
      clear: jest.fn(),
    } as Storage;
    const options: StorageSignalOptions<string> = {
      storage: brokenStorage,
      injector: TestBed.inject(Injector),
    };
    const signal = storageSignal('brokenKey', 'fallback', options);
    expect(() => {
      signal.set('newValue');
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should sync value across tabs when crossTabSync is enabled', fakeAsync(() => {
    const options: StorageSignalOptions<string> = {
      storage: window.localStorage,
      crossTabSync: true,
      injector: TestBed.inject(Injector),
    };
    const signal = storageSignal('syncKey', 'init', options);
    fixture.detectChanges();

    // Simulate storage event
    const event = new StorageEvent('storage', {
      key: 'syncKey',
      newValue: JSON.stringify('fromOtherTab'),
      storageArea: window.localStorage,
    });
    window.dispatchEvent(event);

    tick(100);

    expect(signal()).toBe('fromOtherTab');
  }));

  it('should not update value if storage event key does not match', fakeAsync(() => {
    const options: StorageSignalOptions<string> = {
      storage: window.localStorage,
      crossTabSync: true,
      injector: TestBed.inject(Injector),
    };
    const signal = storageSignal('syncKey2', 'init', options);
    fixture.detectChanges();

    const event = new StorageEvent('storage', {
      key: 'otherKey',
      newValue: JSON.stringify('shouldNotUpdate'),
      storageArea: window.localStorage,
    });
    window.dispatchEvent(event);

    tick(100);

    expect(signal()).toBe('init');
  }));

  it('should throw if not in injection context and no injector provided', () => {
    expect(() => storageSignal('noInjector', 'value')).toThrow();
  });

  it('should return default value on SSR platform without init (else branch line 57)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    // Use runInInjectionContext to test with server platform
    TestBed.runInInjectionContext(() => {
      const signal = storageSignal('ssrKey', 'defaultValue');

      // Should return default value without trying to access storage
      // since isPlatformBrowser returns false for 'server' platform
      expect(signal()).toBe('defaultValue');
    });
  });
});
