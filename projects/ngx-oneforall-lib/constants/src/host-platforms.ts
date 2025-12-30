/**
 * Operating system/platform identifiers.
 * Used by `getHostPlatform()` utility.
 */
export enum HostPlatform {
  MAC = 'MAC',
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WINDOWS = 'WINDOWS',
  LINUX = 'LINUX',
  WINDOWS_PHONE = 'WINDOWS_PHONE',
  /** Returned when platform cannot be detected (e.g., SSR). */
  UNKNOWN = 'UNKNOWN',
}
