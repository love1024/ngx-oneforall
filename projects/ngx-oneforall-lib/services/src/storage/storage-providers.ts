import { InjectionToken } from '@angular/core';
import { StorageEngine } from './storage-engine';
import { StorageService } from './storage.service';

export const SessionStorageService = new InjectionToken<StorageEngine>(
  'SESSION_STORAGE',
  { providedIn: 'root', factory: () => new StorageService(sessionStorage) }
);

export const LocalStorageService = new InjectionToken<StorageEngine>(
  'LOCAL_STORAGE',
  { providedIn: 'root', factory: () => new StorageService(localStorage) }
);
