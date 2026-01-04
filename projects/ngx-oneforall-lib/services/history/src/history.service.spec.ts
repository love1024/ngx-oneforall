import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { HistoryService } from './history.service';
import { provideHistoryService } from './history-provider';

@Component({ template: '' })
class DummyComponent {}

describe('HistoryService', () => {
  let service: HistoryService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'page1', component: DummyComponent },
          { path: 'page2', component: DummyComponent },
          { path: 'page3', component: DummyComponent },
          { path: 'home', component: DummyComponent },
        ]),
        provideHistoryService(),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    service = TestBed.inject(HistoryService);
    service.startTracking();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do nothing when startTracking called twice', fakeAsync(() => {
    router.navigate(['']);
    tick();

    const initialLength = service.length();
    service.startTracking(); // call again

    expect(service.length()).toBe(initialLength);
  }));

  it('should do nothing when not in browser (SSR)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '', component: DummyComponent }]),
        provideHistoryService(),
        { provide: 'PLATFORM_ID', useValue: 'server' },
      ],
    });

    // Create service in SSR context by mocking isBrowser
    const ssrService = TestBed.inject(HistoryService);
    // Access private property for testing
    (ssrService as unknown as { isBrowser: boolean }).isBrowser = false;

    ssrService.startTracking();

    expect(ssrService.length()).toBe(0);
  });

  it('should not add to history when initial URL is empty', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '', component: DummyComponent }]),
        provideHistoryService(),
      ],
    });

    const newRouter = TestBed.inject(Router);
    const newService = TestBed.inject(HistoryService);

    // Mock router.url to return empty string
    Object.defineProperty(newRouter, 'url', { value: '', writable: true });

    newService.startTracking();

    expect(newService.length()).toBe(0);
  });

  it('should track initial URL', fakeAsync(() => {
    router.navigate(['']);
    tick();

    expect(service.currentUrl()).toBe('/');
    expect(service.length()).toBe(1);
  }));

  it('should track navigation', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();
    router.navigate(['page2']);
    tick();

    expect(service.length()).toBe(3);
    expect(service.currentUrl()).toBe('/page2');
    expect(service.previousUrl()).toBe('/page1');
  }));

  it('should report canGoBack correctly', fakeAsync(() => {
    router.navigate(['']);
    tick();

    expect(service.canGoBack()).toBe(false);

    router.navigate(['page1']);
    tick();

    expect(service.canGoBack()).toBe(true);
  }));

  it('should not add duplicate consecutive URLs', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();
    router.navigate(['page1']);
    tick();

    expect(service.length()).toBe(2);
  }));

  it('should return null for previousUrl when only one entry', fakeAsync(() => {
    router.navigate(['']);
    tick();

    expect(service.previousUrl()).toBeNull();
  }));

  it('should clear history', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();

    service.clear();

    expect(service.length()).toBe(0);
    expect(service.currentUrl()).toBeNull();
  }));

  it('should get history array', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();

    const history = service.getHistory();

    expect(history).toEqual(['/', '/page1']);
  }));

  it('should navigate back', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();

    const backSpy = jest.spyOn(location, 'back');
    service.back();

    expect(backSpy).toHaveBeenCalled();
  }));

  it('should not navigate back if no history', fakeAsync(() => {
    router.navigate(['']);
    tick();

    const backSpy = jest.spyOn(location, 'back');
    service.back();

    expect(backSpy).not.toHaveBeenCalled();
  }));

  it('should call location.forward', fakeAsync(() => {
    router.navigate(['']);
    tick();

    const forwardSpy = jest.spyOn(location, 'forward');
    service.forward();

    expect(forwardSpy).toHaveBeenCalled();
  }));

  it('should navigate to fallback if no history', fakeAsync(() => {
    router.navigate(['']);
    tick();

    service.backOrFallback('/home');
    tick();

    expect(router.url).toBe('/home');
  }));

  it('should navigate back instead of fallback if history exists', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();

    const backSpy = jest.spyOn(location, 'back');
    service.backOrFallback('/home');

    expect(backSpy).toHaveBeenCalled();
  }));

  it('should replace current URL without adding to history', fakeAsync(() => {
    router.navigate(['']);
    tick();
    router.navigate(['page1']);
    tick();

    const historyLengthBefore = service.length();
    service.replaceCurrent('/page2');
    tick();

    expect(router.url).toBe('/page2');
    // History should increase by 1 because navigation still happens,
    // but the browser history entry is replaced
    expect(service.length()).toBe(historyLengthBefore + 1);
  }));

  describe('with maxSize config', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', component: DummyComponent },
            { path: 'page1', component: DummyComponent },
            { path: 'page2', component: DummyComponent },
            { path: 'page3', component: DummyComponent },
            { path: 'page4', component: DummyComponent },
          ]),
          provideHistoryService({ maxSize: 3 }),
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      service = TestBed.inject(HistoryService);
      service.startTracking();
    });

    it('should respect maxSize limit', fakeAsync(() => {
      router.navigate(['']);
      tick();
      router.navigate(['page1']);
      tick();
      router.navigate(['page2']);
      tick();
      router.navigate(['page3']);
      tick();
      router.navigate(['page4']);
      tick();

      expect(service.length()).toBe(3);
      expect(service.getHistory()).toEqual(['/page2', '/page3', '/page4']);
    }));
  });
});
