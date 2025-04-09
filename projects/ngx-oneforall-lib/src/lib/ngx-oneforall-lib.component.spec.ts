import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOneforallLibComponent } from './ngx-oneforall-lib.component';

describe('NgxOneforallLibComponent', () => {
  let component: NgxOneforallLibComponent;
  let fixture: ComponentFixture<NgxOneforallLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOneforallLibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxOneforallLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
