import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IdleService } from './idle.service';

describe('IdleService', () => {
  let service: IdleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdleService],
    });
    service = TestBed.inject(IdleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be idle initially', () => {
    expect(service.isIdle()).toBe(false);
  });

  it('should become idle after timeout', fakeAsync(() => {
    service.configure({ timeout: 1000 });
    service.start();

    expect(service.isIdle()).toBe(false);

    tick(1000);

    expect(service.isIdle()).toBe(true);
  }));

  it('should reset idle state on activity', fakeAsync(() => {
    service.configure({ timeout: 1000 });
    service.start();

    tick(500);
    expect(service.isIdle()).toBe(false);

    // Simulate activity by resetting
    service.reset();

    tick(500);
    expect(service.isIdle()).toBe(false);

    tick(500);
    expect(service.isIdle()).toBe(true);
  }));

  it('should not be idle after stop', fakeAsync(() => {
    service.configure({ timeout: 1000 });
    service.start();

    tick(500);
    service.stop();

    tick(1000);
    expect(service.isIdle()).toBe(false);
  }));

  it('should use default timeout when not configured', fakeAsync(() => {
    service.start();
    expect(service.isIdle()).toBe(false);

    // Default is 5 minutes (300000ms)
    tick(300000);
    expect(service.isIdle()).toBe(true);
  }));

  it('should allow custom events configuration', () => {
    service.configure({ events: ['click', 'keydown'] });
    // No assertion needed, just verify it doesn't throw
    expect(service).toBeTruthy();
  });

  it('should not start twice', fakeAsync(() => {
    service.configure({ timeout: 1000 });
    service.start();
    service.start(); // Should be ignored

    tick(1000);
    expect(service.isIdle()).toBe(true);
  }));

  it('should reset do nothing when not running', () => {
    service.reset(); // Should not throw
    expect(service.isIdle()).toBe(false);
  });

  it('should provide isIdle$ observable', fakeAsync(() => {
    const values: boolean[] = [];
    service.configure({ timeout: 1000 });

    service.isIdle$.subscribe(val => values.push(val));
    service.start();

    tick(1000);

    expect(values).toContain(false);
    expect(values).toContain(true);
  }));

  it('should stop do nothing when not running', () => {
    service.stop(); // Should not throw
    expect(service.isIdle()).toBe(false);
  });

  it('should restart when configure is called while running', fakeAsync(() => {
    service.configure({ timeout: 2000 });
    service.start();

    tick(1000); // Halfway to original timeout
    expect(service.isIdle()).toBe(false);

    // Reconfigure with shorter timeout - should restart timer
    service.configure({ timeout: 500 });

    tick(500);
    expect(service.isIdle()).toBe(true);
  }));

  it('should allow stop and start cycle without leaks', fakeAsync(() => {
    service.configure({ timeout: 1000 });

    // First cycle
    service.start();
    tick(500);
    service.stop();
    expect(service.isIdle()).toBe(false);

    // Second cycle - should work correctly
    service.start();
    tick(1000);
    expect(service.isIdle()).toBe(true);
  }));
});
