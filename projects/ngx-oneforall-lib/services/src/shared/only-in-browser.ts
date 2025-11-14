import { isPlatformBrowser } from '@angular/common';
import { getPlatform, PLATFORM_ID } from '@angular/core';

function getCurrentPlatformId() {
  return getPlatform()?.injector.get(PLATFORM_ID);
}

export function OnlyInBrowser() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const platformId = getCurrentPlatformId();
      const isBrowser = platformId ? isPlatformBrowser(platformId) : false;

      if (isBrowser) {
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}
