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
    [enableThousandSeparator]="enableThousandSeparator"
    [thousandSeparator]="thousandSeparator"
    [formControl]="ctrl" />`,
  standalone: true,
  imports: [NumbersOnlyDirective, ReactiveFormsModule],
})
class TestHostComponent {
  decimals = 0;
  negative = false;
  separator = '.';
  enableThousandSeparator = false;
  thousandSeparator = ',';
  ctrl = new FormControl('');
}

@Component({
  template: `<input numbersOnly [enableThousandSeparator]="true" />`,
  standalone: true,
  imports: [NumbersOnlyDirective],
})
class TestHostNoFormsComponent {}

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

  describe('Thousand Separators', () => {
    beforeEach(() => {
      component.enableThousandSeparator = true;
      fixture.detectChanges();
    });

    it('should format integer with thousand separators', () => {
      input.value = '1000';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000');
    });

    it('should format decimal with thousand separators', () => {
      component.decimals = 2;
      fixture.detectChanges();

      input.value = '1234.56';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,234.56');
    });

    it('should handle custom thousand separator', () => {
      component.thousandSeparator = ' ';
      fixture.detectChanges();

      input.value = '1000000';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1 000 000');
    });

    it('should handle negative numbers with thousand separators', () => {
      component.negative = true;
      fixture.detectChanges();

      input.value = '-1000';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('-1,000');
    });

    it('should gracefully remove incorrect separators (auto-correction)', () => {
      input.value = '100,0';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000');
    });

    it('should update form control value with formatted value', () => {
      input.value = '1000000';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000,000');
      expect(component.ctrl.value).toBe('1,000,000');
    });

    it('should maintain invalid keystroke behavior', () => {
      input.value = '1,000';
      input.dispatchEvent(new Event('input')); // establish baseline

      input.value = '1,000a';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000');
    });
    it('should handle invalid value from form control (branch 82)', () => {
      component.ctrl.setValue('abc');
      fixture.detectChanges();
      expect(input.value).toBe('');
    });

    it('should handle formatting from form control without cursor selection (branches 95, 114)', () => {
      component.ctrl.setValue('1000000');
      fixture.detectChanges();
      expect(input.value).toBe('1,000,000');
    });

    it('should place cursor at 0 if no digits before cursor (branch 110)', () => {
      input.value = ',1000';
      input.selectionStart = 1;
      input.selectionEnd = 1;
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000');
      expect(input.selectionStart).toBe(0);
    });

    it('should not update control value if already equals finalValue (branch 120)', () => {
      component.ctrl.setValue('1,000', { emitEvent: false });
      input.value = '1000';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('1,000');
    });

    it('should return selectionStart if calculateCursorPosition loop finishes without finding enough non-separators (branch coverage line 128)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pos = (directive as any).calculateCursorPosition(
        10,
        '1234567890',
        '1,234',
        ','
      );
      expect(pos).toBe(10);
    });
  });
});

describe('NumbersOnlyDirective - Without Forms', () => {
  let fixtureNoForms: ComponentFixture<TestHostNoFormsComponent>;
  let inputNoForms: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumbersOnlyDirective, TestHostNoFormsComponent],
    });
    fixtureNoForms = TestBed.createComponent(TestHostNoFormsComponent);
    fixtureNoForms.detectChanges();
    inputNoForms = fixtureNoForms.nativeElement.querySelector('input');
  });

  it('should format without form control', () => {
    inputNoForms.value = '1000';
    inputNoForms.dispatchEvent(new Event('input'));
    expect(inputNoForms.value).toBe('1,000');
  });
});
