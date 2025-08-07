import { isPlatformBrowser } from '@angular/common';
import { getCurrentPlatformId } from './platform-context';

export function OnlyInBrowser() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const platformId = getCurrentPlatformId();
      const isBrowser = isPlatformBrowser(platformId ?? {});

      if (isBrowser) {
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
