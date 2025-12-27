import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  template: `<input
    numbersOnly
    [decimals]="decimals"
    [negative]="negative"
    [separator]="separator"
    [formControl]="ctrl" />`,
  standalone: true,
  imports: [NumbersOnlyDirective, ReactiveFormsModule],
})
class TestHostComponent {
  decimals = 0;
  negative = false;
  separator = '.';
  ctrl = new FormControl('');
}

describe('NumbersOnlyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;
  let component: TestHostComponent;
  let directive: NumbersOnlyDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, NumbersOnlyDirective, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    input = fixture.nativeElement.querySelector('input');
    directive =
      fixture.debugElement.children[0].injector.get(NumbersOnlyDirective);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should allow only integer numbers by default', () => {
    input.value = '123';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('123');

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('123'); // remains old value

    input.value = '456';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('456');
  });

  it('should allow negative numbers if negative=true', () => {
    component.negative = true;
    fixture.detectChanges();

    input.value = '-123';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('-123');
  });

  it('should allow negative decimals numbers if negative=true', () => {
    component.negative = true;
    component.decimals = 2;
    fixture.detectChanges();

    input.value = '-123';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('-123');
  });

  it('should not allow negative numbers if negative=false', () => {
    component.negative = false;

    fixture.detectChanges();

    input.value = '-123';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('');
  });

  it('should allow decimals if decimals > 0', () => {
    component.decimals = 2;
    fixture.detectChanges();

    input.value = '12.34';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('12.34');
  });

  it('should not allow more decimals than specified', () => {
    component.decimals = 2;
    fixture.detectChanges();

    input.value = '12.345';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('');
  });

  it('should allow custom separator', () => {
    component.decimals = 2;
    component.separator = ',';
    fixture.detectChanges();

    input.value = '12,34';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('12,34');
  });

  it('should allow just "-" if negative is true', () => {
    component.negative = true;
    fixture.detectChanges();

    input.value = '-';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('-');
  });

  it('should revert to old value if input is invalid', () => {
    input.value = '123';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('123');

    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('123');
  });

  it('should update value when form control changes', () => {
    component.ctrl.setValue('456');
    fixture.detectChanges();
    expect(input.value).toBe('456');
  });

  it('should not allow just "-" if negative is false', () => {
    component.negative = false;
    fixture.detectChanges();

    input.value = '-';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('');
  });
});
