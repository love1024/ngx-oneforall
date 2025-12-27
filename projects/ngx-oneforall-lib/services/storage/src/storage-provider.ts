import { inject, InjectionToken, PLATFORM_ID, Provider } from '@angular/core';
import { StorageEngine } from './storage-engine';
import { WebStorageService } from './storages/web-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { MemoryStorageService } from './storages/memory-storage.service';

export const SessionStorageService = new InjectionToken<StorageEngine>(
  'SESSION_STORAGE'
);

export function provideSessionStorage(prefix?: string): Provider {
  return {
    provide: SessionStorageService,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        return new WebStorageService(sessionStorage, prefix);
      }
      return new MemoryStorageService();
    },
  };
}

// Local Storage

export const LocalStorageService = new InjectionToken<StorageEngine>(
  'LOCAL_STORAGE'
);

export function provideLocalStorage(prefix?: string): Provider {
  return {
    provide: LocalStorageService,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        return new WebStorageService(localStorage, prefix);
      }
      return new MemoryStorageService();
    },
  };
}
