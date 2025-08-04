import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';
import { provideCookieService } from './cookie-provider';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCookieService()],
    });
    service = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
