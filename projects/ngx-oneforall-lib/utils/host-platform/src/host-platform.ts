import { HostPlatform } from 'ngx-oneforall/constants';

/**
 * Detects the host platform/operating system based on the user agent string.
 * SSR-safe and handles modern iPadOS detection (iPadOS 13+ reports as Macintosh).
 *
 * @returns The detected `HostPlatform` enum value.
 *
 * @example
 * const platform = getHostPlatform();
 * if (platform === HostPlatform.IOS) {
 *   // iOS-specific logic
 * }
 *
 * @remarks
 * Detection order matters:
 * 1. Windows Phone (before Windows)
 * 2. Windows
 * 3. Android
 * 4. iOS (including iPadOS 13+ via touch detection)
 * 5. Mac
 * 6. Linux
 *
 * Returns `HostPlatform.UNKNOWN` for SSR or unrecognized platforms.
 */
export function getHostPlatform(): HostPlatform {
  // SSR safety check
  if (typeof navigator === 'undefined') {
    return HostPlatform.UNKNOWN;
  }

  const ua = navigator.userAgent || navigator.vendor;

  if (/windows phone/i.test(ua)) return HostPlatform.WINDOWS_PHONE;
  if (/win/i.test(ua)) return HostPlatform.WINDOWS;
  if (/android/i.test(ua)) return HostPlatform.ANDROID;
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) &&
      typeof document !== 'undefined' &&
      'ontouchend' in document)
  )
    return HostPlatform.IOS;
  if (/mac/i.test(ua)) return HostPlatform.MAC;
  if (/linux/i.test(ua)) return HostPlatform.LINUX;

  return HostPlatform.UNKNOWN;
}
