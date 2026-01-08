import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';

@Component({
  template: `<input [mask]="'###-###-####'" />`,
  imports: [MaskDirective],
})
class TestHostComponent {}

describe('MaskDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement
      .query(By.directive(MaskDirective))
      .injector.get(MaskDirective);
    expect(directive).toBeTruthy();
  });
});
