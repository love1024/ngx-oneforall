/* eslint-disable @typescript-eslint/no-explicit-any */
import { HostPlatform } from 'ngx-oneforall/constants';
import { getHostPlatform } from './host-platform';

describe('getHostPlatform', () => {
  let originalNavigator: Navigator;

  beforeEach(() => {
    // Save original navigator
    originalNavigator = global.navigator;
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  function mockUserAgent(userAgent: string, vendor = '') {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent,
        vendor,
      },
      writable: true,
      configurable: true,
    });
  }

  describe('Windows Phone detection', () => {
    it('should detect Windows Phone', () => {
      mockUserAgent(
        'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1) AppleWebKit/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS_PHONE);
    });

    it('should detect Windows Phone (case insensitive)', () => {
      mockUserAgent('Mozilla/5.0 (WINDOWS PHONE 8.1)');
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS_PHONE);
    });
  });

  describe('Windows detection', () => {
    it('should detect Windows 10', () => {
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS);
    });

    it('should detect Windows 11', () => {
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
      );
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS);
    });

    it('should detect Windows (case insensitive)', () => {
      mockUserAgent('Mozilla/5.0 (WIN32)');
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS);
    });

    it('should prioritize Windows Phone over Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows Phone 10.0; Win64)');
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS_PHONE);
    });
  });

  describe('Android detection', () => {
    it('should detect Android phone', () => {
      mockUserAgent(
        'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });

    it('should detect Android tablet', () => {
      mockUserAgent(
        'Mozilla/5.0 (Linux; Android 10; SM-T510) AppleWebKit/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });

    it('should detect Android (case insensitive)', () => {
      mockUserAgent('Mozilla/5.0 (Linux; ANDROID 9)');
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });
  });

  describe('iOS detection', () => {
    it('should detect iPhone', () => {
      mockUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      );
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });

    it('should detect iPad', () => {
      mockUserAgent(
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      );
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });

    it('should detect iPod', () => {
      mockUserAgent(
        'Mozilla/5.0 (iPod touch; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15'
      );
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });

    it('should detect iPad Pro (with touch support)', () => {
      // Mock iPad Pro which reports as Macintosh but has touch support
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
          vendor: '',
        },
        writable: true,
        configurable: true,
      });

      // Mock document with touch support
      Object.defineProperty(document, 'ontouchend', {
        value: null,
        writable: true,
        configurable: true,
      });

      expect(getHostPlatform()).toBe(HostPlatform.IOS);

      // Cleanup
      delete (document as any).ontouchend;
    });
  });

  describe('Mac detection', () => {
    it('should detect macOS', () => {
      mockUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.MAC);
    });

    it('should detect Mac (case insensitive)', () => {
      mockUserAgent('Mozilla/5.0 (MAC OS X 11_0)');
      expect(getHostPlatform()).toBe(HostPlatform.MAC);
    });

    it('should prioritize iOS over Mac for iPad detection', () => {
      mockUserAgent('Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)');
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });
  });

  describe('Linux detection', () => {
    it('should detect Linux desktop', () => {
      mockUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
      expect(getHostPlatform()).toBe(HostPlatform.LINUX);
    });

    it('should detect Linux (case insensitive)', () => {
      mockUserAgent('Mozilla/5.0 (X11; LINUX i686)');
      expect(getHostPlatform()).toBe(HostPlatform.LINUX);
    });

    it('should prioritize Android over Linux', () => {
      mockUserAgent('Mozilla/5.0 (Linux; Android 11)');
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });
  });

  describe('Unknown platform detection', () => {
    it('should return UNKNOWN for unrecognized user agent', () => {
      mockUserAgent('Mozilla/5.0 (Unknown Platform)');
      expect(getHostPlatform()).toBe(HostPlatform.UNKNOWN);
    });

    it('should return UNKNOWN for empty user agent', () => {
      mockUserAgent('');
      expect(getHostPlatform()).toBe(HostPlatform.UNKNOWN);
    });

    it('should handle missing navigator.userAgent gracefully', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          vendor: '',
        },
        writable: true,
        configurable: true,
      });
      expect(getHostPlatform()).toBe(HostPlatform.UNKNOWN);
    });

    it('should return UNKNOWN when navigator is undefined (SSR)', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(getHostPlatform()).toBe(HostPlatform.UNKNOWN);
    });
  });

  describe('Priority order', () => {
    it('should check Windows Phone before Windows', () => {
      mockUserAgent('Windows Phone Win');
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS_PHONE);
    });

    it('should check Android before Linux', () => {
      mockUserAgent('Linux Android');
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });

    it('should check iOS devices before Mac', () => {
      mockUserAgent('iPhone Mac');
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });
  });

  describe('Real-world user agents', () => {
    it('should detect Chrome on Windows', () => {
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.WINDOWS);
    });

    it('should detect Safari on macOS', () => {
      mockUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
      );
      expect(getHostPlatform()).toBe(HostPlatform.MAC);
    });

    it('should detect Firefox on Linux', () => {
      mockUserAgent(
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0'
      );
      expect(getHostPlatform()).toBe(HostPlatform.LINUX);
    });

    it('should detect Chrome on Android', () => {
      mockUserAgent(
        'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
      );
      expect(getHostPlatform()).toBe(HostPlatform.ANDROID);
    });

    it('should detect Safari on iOS', () => {
      mockUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
      );
      expect(getHostPlatform()).toBe(HostPlatform.IOS);
    });
  });
});
