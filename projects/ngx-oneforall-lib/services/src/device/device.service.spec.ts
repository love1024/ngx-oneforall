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
      // Start with an empty userAgent and no userAgentData; tests will set
      // specific UA values when needed.
      Object.defineProperty(navigator, 'userAgent', {
        value: '',
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgentData', {
        value: undefined,
        configurable: true,
      });
      service = TestBed.inject(DeviceService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return correct deviceInfo, deviceType, orientation', fakeAsync(() => {
      // Ensure UA blank so touch detection controls mobile behavior
      Object.defineProperty(navigator, 'userAgent', {
        value: '',
        configurable: true,
      });
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

      // Process the event
      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
      expect(service.deviceInfo?.orientation).toBe('portrait');
      expect(service.deviceType).toBe('mobile');
      expect(service.orientation).toBe('portrait');
    }));

    it('should detect mobile when touch small', fakeAsync(() => {
      // Recreate TestBed with mobile-like environment
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 1,
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgent', {
        value: '',
        configurable: true,
      });

      service = TestBed.inject(DeviceService);
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.isMobile()).toBe(true);
      expect(service.isTablet()).toBe(false);
      expect(service.isDesktop()).toBe(false);
    }));

    it('should detect tablet when touch and large', fakeAsync(() => {
      // Recreate TestBed with tablet-like environment
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 2,
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/604.1',
        configurable: true,
      });

      service = TestBed.inject(DeviceService);
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.isMobile()).toBe(false);
      expect(service.isTablet()).toBe(true);
      expect(service.isDesktop()).toBe(false);
    }));

    it('should detect desktop when non-touch and wide', fakeAsync(() => {
      // Recreate TestBed with desktop-like environment
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        configurable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).ontouchstart;

      service = TestBed.inject(DeviceService);
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.isMobile()).toBe(false);
      expect(service.isTablet()).toBe(false);
      expect(service.isDesktop()).toBe(true);
    }));

    it('should return correct isPortrait and isLandscape', fakeAsync(() => {
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

      tick();

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

      tick();

      expect(service.isPortrait()).toBe(false);
      expect(service.isLandscape()).toBe(true);
    }));

    it('should emit deviceInfo and update signal on resize', fakeAsync(() => {
      // Ensure UA blank so touch detection controls mobile behavior
      Object.defineProperty(navigator, 'userAgent', {
        value: '',
        configurable: true,
      });
      // Simulate resize and assert deviceInfo updated
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      // keep mobile UA from beforeEach
      window.dispatchEvent(new Event('resize'));

      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
      expect(service.deviceInfo?.orientation).toBe('portrait');
    }));

    it('should emit deviceInfo and update signal on orientationchange', fakeAsync(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 500,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });

      window.dispatchEvent(new Event('orientationchange'));
      tick();

      expect(service.deviceInfo?.orientation).toBe('portrait');
    }));

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
      Object.defineProperty(navigator, 'userAgentData', {
        value: { mobile: true },
        configurable: true,
      });

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
      Object.defineProperty(navigator, 'userAgentData', {
        value: undefined,
        configurable: true,
      });

      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
    }));

    it('should return table if width is between 768 and 1024', fakeAsync(() => {
      // Recreate TestBed with tablet-like environment
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 800,
      });
      // ensure height is large enough so minSide >= 768 for touch detection
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 900,
      });
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 2,
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/604.1',
        configurable: true,
      });

      service = TestBed.inject(DeviceService);
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('tablet');
    }));

    it('should return desktop if width is more than or equal 1024', fakeAsync(() => {
      // Recreate TestBed with desktop-like environment
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 800,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        configurable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).ontouchstart;

      service = TestBed.inject(DeviceService);
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('desktop');
    }));

    it('should detect iPadOS (Macintosh + touch points) as tablet', fakeAsync(() => {
      // Recreate TestBed with iPadOS-like environment (Macintosh UA + touch points)
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 820,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1180,
      });

      // iPadOS 13+ reports as Macintosh but is touch-capable; maxTouchPoints > 1
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        configurable: true,
      });
      // ensure ontouchstart exists
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });

      service = TestBed.inject(DeviceService);

      // trigger detection
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('tablet');
    }));

    it('should detect mobile when UA matches MOBILE_RE regex', fakeAsync(() => {
      // Recreate TestBed with environment where UA indicates mobile
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      // Make window large so width-based detection would normally pick desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 800,
      });

      // Provide a UA string that matches MOBILE_RE (Android.*Mobile / Mobile)
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
        configurable: true,
      });
      // Ensure userAgentData doesn't override
      Object.defineProperty(navigator, 'userAgentData', {
        value: undefined,
        configurable: true,
      });
      // ensure ontouchstart is present (optional)
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });

      service = TestBed.inject(DeviceService);

      // trigger detection
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('mobile');
    }));

    it('should return tablet when touch device minSide >= 768 (touch fallback)', fakeAsync(() => {
      // Recreate TestBed with a non-mobile UA so regex branches don't trigger
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          DeviceService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DestroyRef, useValue: {} },
        ],
      });

      // Set window size so the smaller side is >= 768
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 900,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 800,
      });

      // Ensure UA is non-mobile and userAgentData not present
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)',
        configurable: true,
      });
      Object.defineProperty(navigator, 'userAgentData', {
        value: undefined,
        configurable: true,
      });

      // Ensure touch is detected (ontouchstart present)
      Object.defineProperty(window, 'ontouchstart', {
        value: true,
        configurable: true,
      });
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 1,
        configurable: true,
      });

      service = TestBed.inject(DeviceService);

      // trigger detection
      window.dispatchEvent(new Event('resize'));
      tick();

      expect(service.deviceInfo?.type).toBe('tablet');
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
