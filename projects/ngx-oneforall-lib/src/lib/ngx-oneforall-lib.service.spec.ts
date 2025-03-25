import { TestBed } from '@angular/core/testing';

import { NgxOneforallLibService } from './ngx-oneforall-lib.service';

describe('NgxOneforallLibService', () => {
  let service: NgxOneforallLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxOneforallLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
