import { HostPlatform } from '@ngx-oneforall/constants';
import { normalizeKey } from './normalize-key';

describe('normalizeKey', () => {
  describe('Arrow key transformations', () => {
    it('should transform "up" to "arrowup"', () => {
      expect(normalizeKey('up')).toBe('arrowup');
    });

    it('should transform "down" to "arrowdown"', () => {
      expect(normalizeKey('down')).toBe('arrowdown');
    });

    it('should transform "left" to "arrowleft"', () => {
      expect(normalizeKey('left')).toBe('arrowleft');
    });

    it('should transform "right" to "arrowright"', () => {
      expect(normalizeKey('right')).toBe('arrowright');
    });

    it('should handle uppercase arrow keys', () => {
      expect(normalizeKey('UP')).toBe('arrowup');
      expect(normalizeKey('Down')).toBe('arrowdown');
      expect(normalizeKey('LEFT')).toBe('arrowleft');
      expect(normalizeKey('Right')).toBe('arrowright');
    });
  });

  describe('Special key transformations', () => {
    it('should transform "space" to "space"', () => {
      expect(normalizeKey('space')).toBe('space');
    });

    it('should transform "esc" to "escape"', () => {
      expect(normalizeKey('esc')).toBe('escape');
    });

    it('should transform "altleft" to "alt"', () => {
      expect(normalizeKey('altleft')).toBe('alt');
    });

    it('should handle uppercase special keys', () => {
      expect(normalizeKey('SPACE')).toBe('space');
      expect(normalizeKey('ESC')).toBe('escape');
      expect(normalizeKey('AltLeft')).toBe('alt');
    });
  });

  describe('Platform-specific meta key handling', () => {
    it('should convert "meta" to "control" on Windows', () => {
      expect(normalizeKey('meta', HostPlatform.WINDOWS)).toBe('control');
    });

    it('should convert "cmd" to "control" on Windows', () => {
      expect(normalizeKey('cmd', HostPlatform.WINDOWS)).toBe('control');
    });

    it('should convert "command" to "control" on Linux', () => {
      expect(normalizeKey('command', HostPlatform.LINUX)).toBe('control');
    });

    it('should convert "meta" to "control" on Android', () => {
      expect(normalizeKey('meta', HostPlatform.ANDROID)).toBe('control');
    });

    it('should keep "meta" as "meta" on Mac', () => {
      expect(normalizeKey('meta', HostPlatform.MAC)).toBe('meta');
    });

    it('should keep "cmd" as "meta" on Mac', () => {
      expect(normalizeKey('cmd', HostPlatform.MAC)).toBe('meta');
    });

    it('should keep "meta" as "meta" on iOS', () => {
      expect(normalizeKey('meta', HostPlatform.IOS)).toBe('meta');
    });

    it('should keep "command" as "meta" on iOS', () => {
      expect(normalizeKey('command', HostPlatform.IOS)).toBe('meta');
    });

    it('should handle uppercase meta keys on non-Apple platforms', () => {
      expect(normalizeKey('META', HostPlatform.WINDOWS)).toBe('control');
      expect(normalizeKey('CMD', HostPlatform.LINUX)).toBe('control');
      expect(normalizeKey('COMMAND', HostPlatform.ANDROID)).toBe('control');
    });
  });

  describe('Regular keys (no transformation)', () => {
    it('should return regular keys as-is in lowercase', () => {
      expect(normalizeKey('a')).toBe('a');
      expect(normalizeKey('s')).toBe('s');
      expect(normalizeKey('enter')).toBe('enter');
      expect(normalizeKey('tab')).toBe('tab');
      expect(normalizeKey('backspace')).toBe('backspace');
    });

    it('should lowercase uppercase regular keys', () => {
      expect(normalizeKey('A')).toBe('a');
      expect(normalizeKey('S')).toBe('s');
      expect(normalizeKey('ENTER')).toBe('enter');
    });

    it('should handle modifier keys that are not transformed', () => {
      expect(normalizeKey('shift')).toBe('shift');
      expect(normalizeKey('ctrl')).toBe('control');
      expect(normalizeKey('control')).toBe('control');
      expect(normalizeKey('alt')).toBe('alt');
    });
  });

  describe('Whitespace handling', () => {
    it('should trim whitespace from keys', () => {
      expect(normalizeKey('  space  ')).toBe('space');
      expect(normalizeKey('  up  ')).toBe('arrowup');
      expect(normalizeKey(' a ')).toBe('a');
    });

    it('should handle keys with mixed whitespace', () => {
      expect(normalizeKey('\tesc\t')).toBe('escape');
      expect(normalizeKey('\ndown\n')).toBe('arrowdown');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(normalizeKey('')).toBe('');
    });

    it('should handle whitespace-only string', () => {
      expect(normalizeKey('   ')).toBe('');
    });

    it('should default to current platform when platform is not provided', () => {
      // Should not throw and should return a valid result
      const result = normalizeKey('meta');
      expect(typeof result).toBe('string');
    });

    it('should handle unknown platform gracefully', () => {
      expect(normalizeKey('meta', HostPlatform.UNKNOWN)).toBe('control');
    });

    it('should handle numeric keys', () => {
      expect(normalizeKey('1')).toBe('1');
      expect(normalizeKey('0')).toBe('0');
    });

    it('should handle function keys', () => {
      expect(normalizeKey('f1')).toBe('f1');
      expect(normalizeKey('F12')).toBe('f12');
    });
  });

  describe('Case sensitivity', () => {
    it('should be case-insensitive for all transformations', () => {
      expect(normalizeKey('Space')).toBe('space');
      expect(normalizeKey('SPACE')).toBe('space');
      expect(normalizeKey('sPaCe')).toBe('space');

      expect(normalizeKey('Up')).toBe('arrowup');
      expect(normalizeKey('UP')).toBe('arrowup');
      expect(normalizeKey('uP')).toBe('arrowup');
    });
  });
});
