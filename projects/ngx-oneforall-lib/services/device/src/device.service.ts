import {
  Injectable,
  PLATFORM_ID,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeviceType, Orientation } from '@ngx-oneforall/constants';

const MOBILE_RE =
  /(iPhone|Android.*Mobile|Windows Phone|BlackBerry|webOS|Opera Mini|Mobile(\/|\s)|Mobile Safari)/i;
const TABLET_RE =
  /(iPad|Tablet|PlayBook|Silk|Kindle|KF[A-Z]+|Nexus 7|Nexus 9|Nexus 10|Android(?!.*Mobile))/i;

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
}

@Injectable()
export class DeviceService {
  private readonly _deviceInfo = signal<DeviceInfo | null>(null);
  readonly deviceInfoSignal = this._deviceInfo.asReadonly();

  // Remember whether the current runtime environment is a physical desktop.
  // If true we will prefer 'desktop' even when the window is resized small.

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeToOritentationChanges();
      this.subscribeToResizeChanges();
    }
  }

  get deviceInfo(): DeviceInfo | null {
    return this._deviceInfo();
  }

  get deviceType(): DeviceType | null {
    return this._deviceInfo()?.type ?? null;
  }

  get orientation(): Orientation | null {
    return this._deviceInfo()?.orientation ?? null;
  }

  isMobile(): boolean {
    return this.deviceType === 'mobile';
  }

  isTablet(): boolean {
    return this.deviceType === 'tablet';
  }

  isDesktop(): boolean {
    return this.deviceType === 'desktop';
  }

  isPortrait(): boolean {
    return this.orientation === 'portrait';
  }

  isLandscape(): boolean {
    return this.orientation === 'landscape';
  }

  detectDeviceInfo(): DeviceInfo {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      orientation: width > height ? 'landscape' : 'portrait',
      type: this.detectDeviceType(),
    };
  }

  private isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private detectDeviceType(): DeviceType {
    const ua = navigator.userAgent;

    // Chromium userAgentData (most accurate when available)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uaData = (navigator as any).userAgentData;
    if (uaData?.mobile) return 'mobile';

    // iPadOS 13+ (reports as Macintosh)
    const isIpadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    if (isIpadOs) return 'tablet';

    // Regex-based detection
    if (MOBILE_RE.test(ua)) return 'mobile';
    if (TABLET_RE.test(ua)) return 'tablet';

    // Fallback for touch devices (Android tablets, unknown UAs, WebViews)
    if (this.isTouchDevice()) {
      const minSide = Math.min(window.innerWidth, window.innerHeight);
      return minSide >= 768 ? 'tablet' : 'mobile';
    }

    return 'desktop';
  }

  private subscribeToOritentationChanges() {
    fromEvent(window, 'orientationchange')
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._deviceInfo.set(this.detectDeviceInfo());
      });
  }

  private subscribeToResizeChanges() {
    fromEvent(window, 'resize')
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._deviceInfo.set(this.detectDeviceInfo());
      });
  }
}
