import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';
import { IConfigPattern } from './mask.config';

/**
 * Basic usage test cases adapted from ngx-mask
 * Pattern mapping from ngx-mask to our directive:
 * - 0 -> # (required digit)
 * - 9 -> #? (optional digit)
 * - S -> @ (letter only)
 * - A -> A (alphanumeric)
 * - U -> U (uppercase)
 * - L -> L (lowercase)
 */

@Component({
  template: `<input
    [formControl]="form"
    [mask]="mask()"
    [customPatterns]="customPatterns()" />`,
  imports: [MaskDirective, ReactiveFormsModule],
})
class TestMaskComponent {
  mask = signal('(###) ###-####');
  customPatterns = signal<Record<string, IConfigPattern>>({});
  form = new FormControl('');
}

describe('MaskDirective Basic Usage', () => {
  let fixture: ComponentFixture<TestMaskComponent>;
  let component: TestMaskComponent;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaskDirective, TestMaskComponent],
    });
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  function triggerInput(value: string): string {
    inputEl.value = value;
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return inputEl.value;
  }

  function equal(input: string, expected: string): void {
    expect(triggerInput(input)).toBe(expected);
  }

  describe('Pristine and dirty state', () => {
    it('should track pristine and dirty states correctly', () => {
      component.mask.set('####.####');
      fixture.detectChanges();

      expect(component.form.dirty).toBeFalsy();
      expect(component.form.pristine).toBeTruthy();

      equal('1234567', '1234.567');

      expect(component.form.dirty).toBeTruthy();
      expect(component.form.pristine).toBeFalsy();

      component.form.reset();
      expect(component.form.dirty).toBeFalsy();
      expect(component.form.pristine).toBeTruthy();
    });
  });

  describe('Dynamic mask changes', () => {
    it('should work when mask changes on-the-fly', () => {
      component.mask.set('####.####');
      fixture.detectChanges();
      equal('1234567', '1234.567');

      component.mask.set('#.###.###');
      fixture.detectChanges();
      equal('1234567', '1.234.567');
    });
  });

  describe('Basic digit masking', () => {
    it('should mask with decimal format #.##', () => {
      component.mask.set('#.##');
      fixture.detectChanges();
      equal('1', '1');
      equal('12', '1.2');
      equal('123', '1.23');
      equal('1234', '1.23'); // stops at mask length
    });

    it('should mask with ####.#### format', () => {
      component.mask.set('####.####');
      fixture.detectChanges();
      equal('1', '1');
      equal('12', '12');
      equal('123', '123');
      equal('1234', '1234');
      equal('12345', '1234.5');
      equal('123456', '1234.56');
      equal('1234567', '1234.567');
      equal('12345678', '1234.5678');
    });
  });

  describe('User-typed separators', () => {
    it('should accept user typing the separator explicitly', () => {
      component.mask.set('##/##/####');
      fixture.detectChanges();
      equal('00/', '00/');
      equal('00/00/00', '00/00/00');
    });

    it('should handle separator mid-input', () => {
      component.mask.set('##/##/####');
      fixture.detectChanges();
      equal('00', '00');
      equal('00/', '00/');
      equal('00/0', '00/0');
      equal('00/00', '00/00');
      equal('00/00/0', '00/00/0');
      equal('00/00/00', '00/00/00');
    });
  });

  describe('Literal at end of mask', () => {
    it('should handle mask with literal on last char', () => {
      component.mask.set('(##)');
      fixture.detectChanges();
      // Our directive doesn't auto-append trailing literals when input ends before them
      equal('99', '(99');
      // Partial input
      equal('9', '(9');
      // User types closing paren explicitly - it's accepted
      equal('99)', '(99)');
    });
  });

  describe('Phone number masks', () => {
    it('should format phone number (###) ###-####', () => {
      component.mask.set('(###) ###-####');
      fixture.detectChanges();
      equal('1', '(1');
      equal('12', '(12');
      equal('123', '(123');
      equal('1234', '(123) 4');
      equal('12345', '(123) 45');
      equal('(123) 456', '(123) 456');
      equal('(123) 4567', '(123) 456-7');
      equal('1234567890', '(123) 456-7890');
    });
  });

  describe('CPF format (Brazilian tax ID)', () => {
    it('should format CPF ###.###.###-##', () => {
      component.mask.set('###.###.###-##');
      fixture.detectChanges();
      equal('', '');
      equal('1', '1');
      equal('12', '12');
      equal('123', '123');
      equal('1234', '123.4');
      equal('12345', '123.45');
      equal('123456', '123.456');
      equal('1234567', '123.456.7');
      equal('12345678', '123.456.78');
      equal('123456789', '123.456.789');
      equal('1234567890', '123.456.789-0');
      equal('12345678901', '123.456.789-01');
    });
  });

  describe('CNPJ format (Brazilian company ID)', () => {
    it('should format CNPJ ##.###.###/####-##', () => {
      component.mask.set('##.###.###/####-##');
      fixture.detectChanges();
      equal('', '');
      equal('1', '1');
      equal('12', '12');
      equal('123', '12.3');
      equal('1234', '12.34');
      equal('12345', '12.345');
      equal('123456', '12.345.6');
      equal('1234567', '12.345.67');
      equal('12345678', '12.345.678');
      equal('123456789', '12.345.678/9');
      equal('1234567890', '12.345.678/90');
      equal('12345678901', '12.345.678/901');
      equal('123456789012', '12.345.678/9012');
      equal('1234567890123', '12.345.678/9012-3');
      equal('12345678901234', '12.345.678/9012-34');
    });
  });

  describe('Optional digit patterns', () => {
    it('should handle optional digits #?###.##', () => {
      component.mask.set('#?###.##');
      fixture.detectChanges();
      // When user types separator, it fills optionals then matches separator
      equal('1', '1');
      equal('12', '12');
      equal('123', '123');
      equal('1234', '1234');
      equal('12345', '1234.5');
      equal('123456', '1234.56');
    });

    it('should handle mask #?#?##', () => {
      component.mask.set('#?#?##');
      fixture.detectChanges();
      equal('12', '12');
      equal('123', '123');
      equal('1234', '1234');
    });
  });

  describe('UA phone format', () => {
    it('should format UA phone ###-##-##-##-###', () => {
      component.mask.set('###-##-##-##-###');
      fixture.detectChanges();
      equal('380975577234', '380-97-55-77-234');
    });
  });

  describe('Passport number', () => {
    it('should format passport @@ ######', () => {
      component.mask.set('@@ ######');
      fixture.detectChanges();
      equal('GH 234098', 'GH 234098');
    });
  });

  describe('Bank card number', () => {
    it('should format bank card ####-####-####-####', () => {
      component.mask.set('####-####-####-####');
      fixture.detectChanges();
      equal('1234567890123456', '1234-5678-9012-3456');
    });
  });

  describe('Uppercase letter pattern', () => {
    it('should accept only uppercase letters with U pattern', () => {
      component.mask.set('UUUU');
      fixture.detectChanges();
      equal('A', 'A');
      equal('AB', 'AB');
      equal('ABC', 'ABC');
      equal('ABCD', 'ABCD');
    });
  });

  describe('Lowercase letter pattern', () => {
    it('should accept only lowercase letters with L pattern', () => {
      component.mask.set('LLLL');
      fixture.detectChanges();
      equal('a', 'a');
      equal('ab', 'ab');
      equal('abc', 'abc');
      equal('abcd', 'abcd');
    });
  });

  describe('Form control integration', () => {
    it('should strip special characters from form control value', () => {
      component.mask.set('##/##/####');
      fixture.detectChanges();
      triggerInput('30081992');
      expect(component.form.value).toBe('30081992');
    });

    it('should handle setValue correctly', () => {
      component.mask.set('####');
      fixture.detectChanges();
      equal('1234', '1234');
      component.form.setValue(null);
      expect(component.form.value).toBe(null);
    });

    it('should work after form reset', () => {
      component.mask.set('#');
      fixture.detectChanges();
      equal('1', '1');
      component.form.reset();
      equal('1', '1');
      expect(component.form.value).toBe('1');
    });

    it('should show default state after reset control', () => {
      component.mask.set('####');
      fixture.detectChanges();
      equal('1234', '1234');
      component.form.reset();
      expect(component.form.dirty).toBe(false);
      expect(component.form.pristine).toBe(true);
    });
  });

  describe('Optional mask variations', () => {
    it('should work with optional mask #?#.#?#', () => {
      component.mask.set('#?#.#?#');
      fixture.detectChanges();
      equal('2', '2');
      // Digits fill optional positions
      equal('21', '21');
      equal('2134', '21.34');
    });

    it('should handle optional patterns #?#-#?#', () => {
      component.mask.set('#?#-#?#');
      fixture.detectChanges();
      equal('1', '1');
      equal('12', '12');
      equal('123', '12-3');
      equal('1234', '12-34');
    });

    it('should handle mask #?#?#-#?#?#-#?#?#', () => {
      component.mask.set('#?#?#-#?#?#-#?#?#');
      fixture.detectChanges();
      equal('1', '1');
      equal('12', '12');
      equal('123', '123');
      equal('1234', '123-4');
      equal('12345', '123-45');
      equal('123456', '123-456');
      equal('1234567', '123-456-7');
      equal('12345678', '123-456-78');
      equal('123456789', '123-456-789');
    });
  });

  describe('Empty and invalid input', () => {
    it('should filter out invalid characters', () => {
      component.mask.set('(###) ###-####');
      fixture.detectChanges();
      equal('1234567890', '(123) 456-7890');
      // Invalid chars are filtered, valid digits kept, separators auto-inserted
      equal('@1!2$3#4', '(123) 4');
    });

    it('should filter invalid characters', () => {
      component.mask.set('####.####');
      fixture.detectChanges();
      equal('1éáa2aaaaqwo', '12');
      equal('1234567', '1234.567');
    });
  });

  describe('Custom patterns', () => {
    it('should work with custom hex pattern', () => {
      component.mask.set('XXXXXX');
      component.customPatterns.set({
        X: { pattern: /[0-9A-Fa-f]/ },
      });
      fixture.detectChanges();
      equal('FFFFFF', 'FFFFFF');
      equal('abcdef', 'abcdef');
      equal('123456', '123456');
      equal('ghijkl', ''); // invalid hex chars
    });

    it('should work with custom letter-only pattern overriding digit', () => {
      component.mask.set('####');
      component.customPatterns.set({
        '#': { pattern: /[a-zA-Z]/ },
      });
      fixture.detectChanges();
      equal('1234', ''); // digits rejected
      equal('abcd', 'abcd');
      equal('ABCD', 'ABCD');
    });
  });

  describe('Mixed alphanumeric patterns', () => {
    it('should handle alphanumeric A#A #A# format (Canadian postal code)', () => {
      component.mask.set('A#A #A#');
      fixture.detectChanges();
      equal('K1A2B3', 'K1A 2B3');
    });
  });
});
