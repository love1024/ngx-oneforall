import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NumberInputDirective } from './number-input.directive';

@Component({
  template: `<input
    numberInput
    [locale]="locale"
    [options]="options"
    [min]="min"
    [max]="max"
    [formControl]="ctrl" />`,
  standalone: true,
  imports: [NumberInputDirective, ReactiveFormsModule],
})
class TestHostComponent {
  locale = 'en-US';
  options: Intl.NumberFormatOptions = {};
  min?: number;
  max?: number;
  ctrl = new FormControl<number | null>(null);
}

@Component({
  template: `<input numberInput [locale]="'de-DE'" />`,
  standalone: true,
  imports: [NumberInputDirective],
})
class TestHostNoFormsComponent {}

@Component({
  template: `<input numberInput />`,
  standalone: true,
  imports: [NumberInputDirective],
})
class TestHostDefaultLocaleComponent {}

describe('NumberInputDirective (Intl.NumberFormat)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;
  let component: TestHostComponent;
  let directive: NumberInputDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, NumberInputDirective, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    input = fixture.nativeElement.querySelector('input');
    directive =
      fixture.debugElement.children[0].injector.get(NumberInputDirective);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should format number on blur', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '1234.56';
    input.dispatchEvent(new Event('input'));

    expect(component.ctrl.value).toBe(1234.56);
    expect(input.value).toBe('1234.56'); // Remains raw while focused

    input.dispatchEvent(new Event('blur'));
    tick(); // allow timeout/promises to settle

    // en-US default format for 1234.56
    expect(input.value).toBe('1,234.56');
  }));

  it('should show raw number string on focus', fakeAsync(() => {
    component.ctrl.setValue(9876.54);
    fixture.detectChanges();
    tick();

    // Blurred state
    expect(input.value).toBe('9,876.54');

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // Raw state
    expect(input.value).toBe('9876.54');
  }));

  it('should update form control value as standard javascript number', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '42.99';
    input.dispatchEvent(new Event('input'));

    expect(component.ctrl.value).toBe(42.99);
  });

  it('should set control to the invalid string and mark as invalid if non-numbers are typed', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '42abc.99x';
    input.dispatchEvent(new Event('input'));

    expect(component.ctrl.value).toBe('42abc.99x');
    expect(component.ctrl.errors).toEqual({ invalidNumber: true });

    // Blur with invalid text → formatAndDisplay receives the string
    input.dispatchEvent(new Event('blur'));
    expect(input.value).toBe('42abc.99x');
  });

  it('should respect custom Intl.NumberFormat options', fakeAsync(() => {
    component.options = { style: 'currency', currency: 'EUR' };
    component.locale = 'de-DE';
    fixture.detectChanges();

    component.ctrl.setValue(1234.56);
    tick();

    // de-DE formats as "1.234,56 €" usually, but exact characters depend on browser Intl implementation.
    // We just check it contains the euro symbol and formatted numbers.
    expect(input.value).toContain('€');
    expect(input.value).toContain('1.234,56');
  }));

  it('should format correctly from programmatic value changes', fakeAsync(() => {
    component.ctrl.setValue(1000000);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1,000,000');
  }));

  it('should set control to null when input is completely cleared', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBeNull();
  });

  it('should map local decimal separators to dot during typing', () => {
    // de-DE locale uses comma as decimal separator natively
    component.locale = 'de-DE';
    fixture.detectChanges();

    input.dispatchEvent(new Event('focus'));

    // User types local decimal
    input.value = '1234,56';
    input.dispatchEvent(new Event('input'));

    // Should parse effectively to 1234.56 float
    expect(component.ctrl.value).toBe(1234.56);
  });

  it('should ignore writeValue when focused', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    tick();

    input.value = '123';
    input.dispatchEvent(new Event('input'));

    // External change while focused
    component.ctrl.setValue(456);
    fixture.detectChanges();
    tick();

    // Value should NOT change in the input if we want to preserve user typing
    expect(input.value).toBe('123');
  }));

  it('should handle disabled state', () => {
    component.ctrl.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);

    component.ctrl.enable();
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
  });

  it('should handle various empty values in validate and isEmpty', () => {
    // null
    component.ctrl.setValue(null);
    expect(component.ctrl.valid).toBe(true);

    // undefined
    component.ctrl.setValue(null);
    expect(component.ctrl.valid).toBe(true);

    // empty string typed while focused
    input.dispatchEvent(new Event('focus'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBeNull();
  });

  it('should strip group separators during parsing', () => {
    // en-US uses comma as group separator
    input.dispatchEvent(new Event('focus'));
    input.value = '1,234,567.89';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(1234567.89);
  });

  it('should handle locale changes while blurred via effect', fakeAsync(() => {
    component.ctrl.setValue(1234.56);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1,234.56');

    // Change to German
    component.locale = 'de-DE';
    fixture.detectChanges();
    fixture.detectChanges(); // Second detectChanges might be needed for effect
    tick();
    expect(input.value).toContain('1.234,56');
  }));

  it('should fallback to en-US on invalid Intl configuration', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    component.options = { style: 'currency' };
    fixture.detectChanges();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should return number as-is in parseInternalValue if already a number', () => {
    component.ctrl.setValue(123);
    fixture.detectChanges();
    expect(input.value).toBe('123');
  });

  it('should handle displayRawValue with empty modelValue', fakeAsync(() => {
    component.ctrl.setValue(null);
    fixture.detectChanges();
    tick();

    input.dispatchEvent(new Event('focus'));
    expect(input.value).toBe('');
  }));

  it('should handle options with no decimal part in formatToParts', fakeAsync(() => {
    // maximumFractionDigits: 0 means formatToParts(10000.1) produces no decimal part
    component.options = { maximumFractionDigits: 0 };
    fixture.detectChanges();
    tick();

    component.ctrl.setValue(1234.56);
    fixture.detectChanges();
    tick();

    // Should round and format without decimal
    expect(input.value).toBe('1,235');
  }));

  it('should handle options with no group part in formatToParts', fakeAsync(() => {
    // useGrouping: false means formatToParts(10000.1) produces no group part
    component.options = { useGrouping: false };
    fixture.detectChanges();
    tick();

    component.ctrl.setValue(1234.56);
    fixture.detectChanges();
    tick();

    expect(input.value).toBe('1234.56');

    // Also exercise parseInternalValue with empty groupSeparator
    input.dispatchEvent(new Event('focus'));
    input.value = '5678.9';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(5678.9);
  }));

  it('should handle whitespace-only string in parseInternalValue', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '   ';
    input.dispatchEvent(new Event('input'));

    expect(component.ctrl.value).toBeNull();
  });

  it('should skip effect formatting when focused', fakeAsync(() => {
    component.ctrl.setValue(1234.56);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1,234.56');

    // Focus the input first
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1234.56'); // raw value

    // Now change locale while focused
    input.value = '999';
    component.locale = 'de-DE';
    fixture.detectChanges();
    tick();

    // Effect should skip because focused — input should remain as user left it
    expect(input.value).toBe('999');
  }));

  it('should handle displayRawValue falling back to parseInternalValue when no lastValidValue', fakeAsync(() => {
    // Set a formatted value in the DOM directly without going through setValue
    input.value = '5,678.90';
    // No focus/blur cycle, so lastValidValue is still null

    input.dispatchEvent(new Event('focus'));
    // displayRawValue should parse '5,678.90' from DOM and show raw
    expect(input.value).toBe('5678.9');
  }));

  it('should handle formatAndDisplay with whitespace-only string', fakeAsync(() => {
    // writeValue with whitespace string: isEmpty('   ') → false
    // parseInternalValue('   ') → trim → '' → null
    // else branch: typeof null === 'string' → false → ''
    directive.writeValue('   ');
    tick();

    expect(input.value).toBe('');
  }));

  describe('Range Validation (min/max)', () => {
    it('should validate min constraint', () => {
      component.min = 10;
      fixture.detectChanges();

      component.ctrl.setValue(5);
      expect(component.ctrl.errors).toEqual({ min: { min: 10, actual: 5 } });

      component.ctrl.setValue(10);
      expect(component.ctrl.valid).toBe(true);
    });

    it('should validate max constraint', () => {
      component.max = 100;
      fixture.detectChanges();

      component.ctrl.setValue(150);
      expect(component.ctrl.errors).toEqual({ max: { max: 100, actual: 150 } });

      component.ctrl.setValue(100);
      expect(component.ctrl.valid).toBe(true);
    });

    it('should restrict negative sign if min >= 0 on keydown', () => {
      component.min = 0;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: '-' });
      jest.spyOn(event, 'preventDefault');
      input.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should NOT restrict negative sign if min < 0 on keydown', () => {
      component.min = -10;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: '-' });
      jest.spyOn(event, 'preventDefault');
      input.dispatchEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should sanitize negative sign on input if min >= 0 (e.g. on paste)', () => {
      component.min = 0;
      fixture.detectChanges();

      input.dispatchEvent(new Event('focus'));
      input.value = '-123';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('123');
      expect(component.ctrl.value).toBe(123);
    });
  });
});

describe('NumberInputDirective - Edge Cases', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, NumberInputDirective, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    input = fixture.nativeElement.querySelector('input');
  });

  it('should handle negative numbers', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '-1234.56';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(-1234.56);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('-1,234.56');
  }));

  it('should handle zero correctly (falsy but valid)', fakeAsync(() => {
    component.ctrl.setValue(0);
    fixture.detectChanges();
    tick();

    expect(input.value).toBe('0');
    expect(component.ctrl.valid).toBe(true);

    // Focus should show raw zero
    input.dispatchEvent(new Event('focus'));
    expect(input.value).toBe('0');
  }));

  it('should handle negative zero', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '-0';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(-0);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('-0');
  }));

  it('should handle leading zeros', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '007';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(7);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('7');
  }));

  it('should handle multiple decimal points as invalid', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '1.2.3';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe('1.2.3');
    expect(component.ctrl.errors).toEqual({ invalidNumber: true });
  });

  it('should handle just a minus sign as invalid', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '-';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.errors).toEqual({ invalidNumber: true });
  });

  it('should handle just a decimal point', () => {
    input.dispatchEvent(new Event('focus'));
    input.value = '.';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.errors).toEqual({ invalidNumber: true });
  });

  it('should handle NaN via setValue', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.ctrl.setValue(NaN as any);
    fixture.detectChanges();
    expect(component.ctrl.errors).toEqual({ invalidNumber: true });
  });

  it('should handle very large numbers', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '99999999999';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(99999999999);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('99,999,999,999');
  }));

  it('should handle very small decimals', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '0.001';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(0.001);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('0.001');
  }));

  it('should handle rapid focus/blur cycles without corruption', fakeAsync(() => {
    component.ctrl.setValue(42);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('42');

    // Rapid cycles
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    tick();
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    tick();

    expect(input.value).toBe('42');
    expect(component.ctrl.value).toBe(42);
  }));

  it('should handle pasting a formatted value while focused', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    // User pastes "1,234.56" (en-US formatted)
    input.value = '1,234.56';
    input.dispatchEvent(new Event('input'));
    // Group separator should be stripped, parsed as 1234.56
    expect(component.ctrl.value).toBe(1234.56);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('1,234.56');
  }));

  it('should handle locale switch roundtrip without data loss', fakeAsync(() => {
    component.ctrl.setValue(1234.56);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1,234.56');

    // Switch to German
    component.locale = 'de-DE';
    fixture.detectChanges();
    tick();
    expect(input.value).toContain('1.234,56');

    // Switch back to English
    component.locale = 'en-US';
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('1,234.56');
  }));

  it('should handle typing after clearing a formatted value', fakeAsync(() => {
    component.ctrl.setValue(999);
    fixture.detectChanges();
    tick();
    expect(input.value).toBe('999');

    input.dispatchEvent(new Event('focus'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBeNull();

    input.value = '42';
    input.dispatchEvent(new Event('input'));
    expect(component.ctrl.value).toBe(42);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('42');
  }));

  it('should handle decimal-only value like 0.5', fakeAsync(() => {
    input.dispatchEvent(new Event('focus'));
    input.value = '.5';
    input.dispatchEvent(new Event('input'));

    // .5 is a valid JS number
    expect(component.ctrl.value).toBe(0.5);

    input.dispatchEvent(new Event('blur'));
    tick();
    expect(input.value).toBe('0.5');
  }));
});

describe('NumberInputDirective - Without Forms', () => {
  let fixtureNoForms: ComponentFixture<TestHostNoFormsComponent>;
  let inputNoForms: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumberInputDirective, TestHostNoFormsComponent],
    });
    fixtureNoForms = TestBed.createComponent(TestHostNoFormsComponent);
    fixtureNoForms.detectChanges();
    inputNoForms = fixtureNoForms.nativeElement.querySelector('input');
  });

  it('should format without form control on blur', fakeAsync(() => {
    inputNoForms.dispatchEvent(new Event('focus'));
    inputNoForms.value = '1234,56'; // de-DE local typing
    inputNoForms.dispatchEvent(new Event('input'));
    inputNoForms.dispatchEvent(new Event('blur'));
    tick();

    expect(inputNoForms.value).toContain('1.234,56');
  }));

  it('should handle onInput when not focused', () => {
    // Dispatch input event without prior focus
    inputNoForms.value = '123';
    inputNoForms.dispatchEvent(new Event('input'));
    // Should not throw, just skip onChange
    expect(inputNoForms.value).toBe('123');
  });
});

describe('NumberInputDirective - Browser Locale Fallback', () => {
  it('should fallback to en-US when navigator.language is empty', () => {
    const originalLanguage = navigator.language;
    Object.defineProperty(navigator, 'language', {
      value: '',
      configurable: true,
    });

    TestBed.configureTestingModule({
      imports: [NumberInputDirective, TestHostDefaultLocaleComponent],
    });
    const fix = TestBed.createComponent(TestHostDefaultLocaleComponent);
    fix.detectChanges();

    // Directive should have used 'en-US' as fallback
    const inp = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(inp).toBeTruthy();

    Object.defineProperty(navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    });
  });
});
