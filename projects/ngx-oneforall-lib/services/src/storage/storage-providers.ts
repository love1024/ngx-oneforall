import { inject, InjectionToken, PLATFORM_ID, Provider } from '@angular/core';
import { StorageEngine } from './storage-engine';
import { WebStorageService } from './web-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { MemoryStorageService } from './memory-storage.service';

export const SessionStorageService = new InjectionToken<StorageEngine>(
  'SESSION_STORAGE'
);

export function provideSessionStorage(): Provider {
  return {
    provide: SessionStorageService,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        return new WebStorageService(sessionStorage);
      }
      return new MemoryStorageService();
    },
  };
}

// Local Storage

export const LocalStorageService = new InjectionToken<StorageEngine>(
  'LOCAL_STORAGE'
);

export function provideLocalStorage(): Provider {
  return {
    provide: LocalStorageService,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        return new WebStorageService(localStorage);
      }
      return new MemoryStorageService();
    },
  };
}
