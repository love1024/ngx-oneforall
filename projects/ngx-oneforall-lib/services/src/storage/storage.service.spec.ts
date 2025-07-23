import { TestBed } from '@angular/core/testing';

import { WebStorageService } from './web-storage.service';

describe('StorageService', () => {
  let service: WebStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
