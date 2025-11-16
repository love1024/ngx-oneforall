import {
  Injectable,
  PLATFORM_ID,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, fromEvent, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
}

@Injectable()
export class DeviceService {
  private readonly _deviceInfo$ = new BehaviorSubject<DeviceInfo | null>(null);
  private readonly _deviceInfoSignal = signal<DeviceInfo | null>(null);
  readonly deviceInfo$ = this._deviceInfo$.asObservable();
  readonly deviceInfoSignal = this._deviceInfoSignal.asReadonly();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeToOritentationChanges();
      this.subscribeToResizeChanges();
    }
  }

  get deviceInfo(): DeviceInfo | null {
    return this._deviceInfo$.value;
  }

  get deviceType(): DeviceType | null {
    return this._deviceInfo$.value?.type ?? null;
  }

  get orientation(): Orientation | null {
    return this._deviceInfo$.value?.orientation ?? null;
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

  private detectDeviceInfo(): DeviceInfo {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';
    const isTouch = 'ontouchstart' in window;

    // Chromium-based browsers support userAgentData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uaData = (navigator as any).userAgentData;
    if (uaData?.mobile) {
      return { type: 'mobile', orientation };
    }

    // Fallback: width-based + touch detection
    if (width < 768 || (isTouch && width < 900)) {
      return { type: 'mobile', orientation };
    } else if (width >= 768 && width < 1024) {
      return { type: 'tablet', orientation };
    } else {
      return { type: 'desktop', orientation };
    }
  }

  private subscribeToResizeChanges() {
    fromEvent(window, 'orientationchange')
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._deviceInfo$.next(this.detectDeviceInfo());
        this._deviceInfoSignal.set(this.detectDeviceInfo());
      });
  }

  private subscribeToOritentationChanges() {
    fromEvent(window, 'resize')
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._deviceInfo$.next(this.detectDeviceInfo());
        this._deviceInfoSignal.set(this.detectDeviceInfo());
      });
  }
}
