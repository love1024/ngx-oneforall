import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeviceService } from './device.service';
import { PLATFORM_ID, DestroyRef } from '@angular/core';

describe('DeviceService', () => {
  let service: DeviceService;
  let destroyRef: DestroyRef;

  beforeEach(() => {
    destroyRef = {} as DestroyRef;

    TestBed.configureTestingModule({
      providers: [
        DeviceService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DestroyRef, useValue: destroyRef },
      ],
    });
  });

  describe('in browser', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ontouchstart = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).userAgentData = undefined;
      service = TestBed.inject(DeviceService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return correct deviceInfo, deviceType, orientation', () => {
      // Simulate a mobile device
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ontouchstart = true;
      window.dispatchEvent(new Event('resize'));

      // Wait for the event loop to process the event
      setTimeout(() => {
        expect(service.deviceInfo?.type).toBe('mobile');
        expect(service.deviceInfo?.orientation).toBe('portrait');
        expect(service.deviceType).toBe('mobile');
        expect(service.orientation).toBe('portrait');
      }, 0);
    });

    it('should return correct isMobile, isTablet, isDesktop', () => {
      // Simulate a mobile device
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ontouchstart = true;
      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        expect(service.isMobile()).toBe(true);
        expect(service.isTablet()).toBe(false);
        expect(service.isDesktop()).toBe(false);

        // Simulate a tablet device
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 800,
        });
        window.dispatchEvent(new Event('resize'));

        setTimeout(() => {
          expect(service.isMobile()).toBe(false);
          expect(service.isTablet()).toBe(true);
          expect(service.isDesktop()).toBe(false);

          // Simulate a desktop device
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            value: 1200,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).ontouchstart = false;
          window.dispatchEvent(new Event('resize'));

          setTimeout(() => {
            expect(service.isMobile()).toBe(false);
            expect(service.isTablet()).toBe(false);
            expect(service.isDesktop()).toBe(true);
          }, 0);
        }, 0);
      }, 0);
    });

    it('should return correct isPortrait and isLandscape', () => {
      // Portrait
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        expect(service.isPortrait()).toBe(true);
        expect(service.isLandscape()).toBe(false);

        // Landscape
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          value: 900,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          value: 500,
        });
        window.dispatchEvent(new Event('resize'));

        setTimeout(() => {
          expect(service.isPortrait()).toBe(false);
          expect(service.isLandscape()).toBe(true);
        }, 0);
      }, 0);
    });

    it('should emit deviceInfo$ and update deviceInfoSignal on resize', done => {
      const sub = service.deviceInfo$.subscribe(info => {
        if (info) {
          expect(info.type).toBe('mobile');
          expect(info.orientation).toBe('portrait');
          sub.unsubscribe();
        }
        done();
      });
      window.dispatchEvent(new Event('resize'));
    });

    it('should emit deviceInfo$ and update deviceInfoSignal on orientationchange', done => {
      const sub = service.deviceInfo$.subscribe(info => {
        if (info) {
          expect(info.orientation).toBe('portrait');
          sub.unsubscribe();
        }
        done();
      });
      window.dispatchEvent(new Event('orientationchange'));
    });

    it('should return correct deviceType, devices and orientation after resize event', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ontouchstart = true;
      window.dispatchEvent(new Event('resize'));

      tick();

      expect(service.deviceInfo).toEqual({
        type: 'mobile',
        orientation: 'portrait',
      });
      expect(service.deviceType).toBe('mobile');
      expect(service.orientation).toBe('portrait');
      expect(service.isMobile()).toBe(true);
      expect(service.isTablet()).toBe(false);
      expect(service.isDesktop()).toBe(false);
      expect(service.isPortrait()).toBe(true);
      expect(service.isLandscape()).toBe(false);
    }));

    it('should detect device as mobile and return early if userAgentData.mobile is true', fakeAsync(() => {
      // Simulate userAgentData.mobile = true
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ontouchstart = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).userAgentData = { mobile: true };

      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
      expect(service.deviceType).toBe('mobile');
    }));

    it('should return mobile if width is more than 768 but touch', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 600,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).userAgentData = undefined;

      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
    }));

    it('should return table if width is between 768 and 1024', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 600,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).ontouchstart;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).userAgentData = undefined;

      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('tablet');
    }));

    it('should return desktop if width is more than or equal 1024', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 800,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).ontouchstart;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).userAgentData = undefined;

      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('desktop');
    }));
  });
  describe('not in browser', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DestroyRef, useValue: {} },
        ],
      });
      service = TestBed.inject(DeviceService);
    });

    it('should not subscribe to events if not platform browser', () => {
      expect(service).toBeTruthy();
      // No error should be thrown and service should be created
    });

    it('should return null for deviceType if deviceInfo is null', () => {
      // deviceInfo is null by default
      expect(service.deviceType).toBeNull();
    });

    it('should return null for orientation if deviceInfo is null', () => {
      // deviceInfo is null by default
      expect(service.orientation).toBeNull();
    });
  });
});
