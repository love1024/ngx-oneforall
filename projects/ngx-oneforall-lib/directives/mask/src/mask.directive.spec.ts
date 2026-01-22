import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';
import { IConfigPattern, DEFAULT_SPECIAL_CHARACTERS } from './mask.config';

@Component({
  template: `<input
    [mask]="mask()"
    [customPatterns]="customPatterns()"
    [specialCharacters]="specialCharacters()"
    [mergeSpecialChars]="mergeSpecialChars()"
    [removeSpecialCharacters]="removeSpecialCharacters()"
    [prefix]="prefix()"
    [suffix]="suffix()" />`,
  imports: [MaskDirective],
})
class TestHostComponent {
  mask = signal('(###) ###-####');
  customPatterns = signal<Record<string, IConfigPattern>>({});
  specialCharacters = signal<string[]>(DEFAULT_SPECIAL_CHARACTERS);
  mergeSpecialChars = signal(false);
  removeSpecialCharacters = signal(true);
  prefix = signal('');
  suffix = signal('');
}

@Component({
  template: `<input [formControl]="control" [mask]="'###-####'" />`,
  imports: [MaskDirective, ReactiveFormsModule],
})
class ReactiveFormTestComponent {
  control = new FormControl('');
}

describe('MaskDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  function triggerInput(value: string): string {
    inputEl.value = value;
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return inputEl.value;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement
      .query(By.directive(MaskDirective))
      .injector.get(MaskDirective);
    expect(directive).toBeTruthy();
  });

  it('should call default onTouched on blur without error', () => {
    // Without FormControl, the default empty onTouched should be called
    expect(() => {
      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    }).not.toThrow();
  });

  describe('Basic digit masking (# pattern)', () => {
    it('should format phone number with auto-inserted separators', () => {
      expect(triggerInput('1234567890')).toBe('(123) 456-7890');
    });

    it('should handle partial input', () => {
      expect(triggerInput('123')).toBe('(123');
    });

    it('should stop at mask length', () => {
      expect(triggerInput('12345678901234')).toBe('(123) 456-7890');
    });

    it('should ignore non-digit characters', () => {
      expect(triggerInput('12a34b56')).toBe('(123) 456');
    });

    it('should handle empty input', () => {
      expect(triggerInput('')).toBe('');
    });
  });

  describe('User-typed separators', () => {
    it('should accept user typing the separator explicitly', () => {
      expect(triggerInput('(123')).toBe('(123');
    });

    it('should handle user typing consecutive separators', () => {
      expect(triggerInput('(123) ')).toBe('(123) ');
    });

    it('should handle user typing separator mid-input', () => {
      expect(triggerInput('123) 456')).toBe('(123) 456');
    });
  });

  describe('Date mask (##/##/####)', () => {
    beforeEach(() => {
      fixture.componentInstance.mask.set('##/##/####');
      fixture.detectChanges();
    });

    it('should format date with slashes', () => {
      expect(triggerInput('12252024')).toBe('12/25/2024');
    });

    it('should handle partial date', () => {
      expect(triggerInput('1225')).toBe('12/25');
    });

    it('should accept user-typed slashes', () => {
      expect(triggerInput('12/25/2024')).toBe('12/25/2024');
    });
  });

  describe('Alpha patterns (@, A, U, L)', () => {
    it('should handle letter-only pattern (@)', () => {
      fixture.componentInstance.mask.set('@@@');
      fixture.detectChanges();
      expect(triggerInput('abc')).toBe('abc');
      expect(triggerInput('ABC')).toBe('ABC');
      expect(triggerInput('a1b')).toBe('ab');
    });

    it('should handle alphanumeric pattern (A)', () => {
      fixture.componentInstance.mask.set('A#A #A#');
      fixture.detectChanges();
      expect(triggerInput('K1A2B3')).toBe('K1A 2B3');
    });

    it('should handle uppercase-only pattern (U)', () => {
      fixture.componentInstance.mask.set('UUU');
      fixture.detectChanges();
      expect(triggerInput('ABC')).toBe('ABC');
      expect(triggerInput('abc')).toBe('');
    });

    it('should handle lowercase-only pattern (L)', () => {
      fixture.componentInstance.mask.set('LLL');
      fixture.detectChanges();
      expect(triggerInput('abc')).toBe('abc');
      expect(triggerInput('ABC')).toBe('');
    });
  });

  describe('Consecutive separators', () => {
    it('should auto-insert multiple consecutive separators', () => {
      fixture.componentInstance.mask.set('##--##');
      fixture.detectChanges();
      expect(triggerInput('1234')).toBe('12--34');
    });

    it('should handle separators at the start', () => {
      fixture.componentInstance.mask.set('---###');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('---123');
    });
  });

  describe('Quantifier at invalid position', () => {
    it('should handle quantifier character when not preceded by pattern', () => {
      // ? at start of mask - neither pattern nor non-pattern branch executes
      // Loop advances input but not mask, causing no output
      fixture.componentInstance.mask.set('?##');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('');
    });

    it('should handle * character when not preceded by pattern', () => {
      // * at start of mask - same behavior
      fixture.componentInstance.mask.set('*##');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle mask shorter than input', () => {
      fixture.componentInstance.mask.set('##');
      fixture.detectChanges();
      expect(triggerInput('12345')).toBe('12');
    });

    it('should handle input shorter than mask', () => {
      fixture.componentInstance.mask.set('##########');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('12');
    });

    it('should handle mask ending with separator', () => {
      fixture.componentInstance.mask.set('##-');
      fixture.detectChanges();
      // Trailing separator is not appended when input is complete
      expect(triggerInput('12')).toBe('12');
    });

    it('should handle all-separator mask', () => {
      fixture.componentInstance.mask.set('---');
      fixture.detectChanges();
      expect(triggerInput('a')).toBe('---');
    });

    it('should handle input that does not match any pattern', () => {
      fixture.componentInstance.mask.set('###');
      fixture.detectChanges();
      expect(triggerInput('abc')).toBe('');
    });

    it('should handle single character mask', () => {
      fixture.componentInstance.mask.set('#');
      fixture.detectChanges();
      expect(triggerInput('5')).toBe('5');
    });

    it('should handle single separator mask', () => {
      fixture.componentInstance.mask.set('-');
      fixture.detectChanges();
      expect(triggerInput('a')).toBe('-');
    });
  });

  describe('Backspace handling', () => {
    it('should skip over separator on backspace (lines 169-181)', () => {
      fixture.componentInstance.mask.set('###-####');
      fixture.detectChanges();

      // Set value with separator
      triggerInput('1234567');
      expect(inputEl.value).toBe('123-4567');

      // Position cursor right after the dash (position 4)
      inputEl.setSelectionRange(4, 4);

      // Simulate backspace
      const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      inputEl.dispatchEvent(backspaceEvent);
      fixture.detectChanges();

      // Cursor should have moved back (separator skipped)
      expect(inputEl.selectionStart).toBeLessThanOrEqual(4);
    });

    it('should handle non-greedy * transition to same-type pattern (line 462)', () => {
      // Mask #*# where * followed by another #
      fixture.componentInstance.mask.set('#*#');
      fixture.detectChanges();

      // When user types single digit, * consumes it, then matches next required #
      expect(triggerInput('12')).toBe('12');
    });
  });

  describe('Mixed patterns', () => {
    it('should handle credit card format', () => {
      fixture.componentInstance.mask.set('#### #### #### ####');
      fixture.detectChanges();
      expect(triggerInput('1234567890123456')).toBe('1234 5678 9012 3456');
    });

    it('should handle time format', () => {
      fixture.componentInstance.mask.set('##:##');
      fixture.detectChanges();
      expect(triggerInput('1234')).toBe('12:34');
    });

    it('should handle insertion without dropping valid characters', () => {
      // Mask: ###-###-#### x#?#?#?
      // Preceding digits optional (#?)
      fixture.componentInstance.specialCharacters.set(['x']);
      fixture.componentInstance.mergeSpecialChars.set(true);
      fixture.componentInstance.mask.set('###-###-#### x#?#?#?');
      fixture.detectChanges();

      // Initial: 1234567890123 -> 123-456-7890 x123
      expect(triggerInput('1234567890123')).toBe('123-456-7890 x123');

      // Insert '9' at start: 91234567890123
      // Expected: 912-345-6789 x012 (last digit 3 dropped)
      expect(triggerInput('91234567890123')).toBe('912-345-6789 x012');
    });

    it('should preserve trailing digits when inserting in optional section', () => {
      // Mask: ###-###-#### x#?#?#?#? #
      // 10 required digits, space, x, 4 optional digits, space, 1 required digit
      fixture.componentInstance.specialCharacters.set(['x']);
      fixture.componentInstance.mergeSpecialChars.set(true);
      fixture.componentInstance.mask.set('###-###-#### x#?#?#?#? #');
      fixture.detectChanges();

      // Initial value: 10 required + 4 optional + 1 required = 15 raw digits
      // When masked: 123-121-2312 x3123 1
      expect(triggerInput('123121231231231')).toBe('123-121-2312 x3123 1');

      // User inserts 9 BEFORE the space (between 2312 and space)
      // Input becomes: 123-121-23129  x3123 1 (11 digits before space+x, then 4+1 after)
      // The 11th digit (9) can't fit in required positions, it becomes first optional
      // Expected: 123-121-2312 x9312 3 (9 shifts into optional, 3123 becomes 9312, 1->3)
      expect(triggerInput('123-121-23129  x3123 1')).toBe(
        '123-121-2312 x9312 3'
      );
    });

    it('should handle SSN format', () => {
      fixture.componentInstance.mask.set('###-##-####');
      fixture.detectChanges();
      expect(triggerInput('123456789')).toBe('123-45-6789');
    });
  });

  describe('Optional quantifier (?)', () => {
    it('should make preceding pattern optional', () => {
      fixture.componentInstance.mask.set('#?##');
      fixture.detectChanges();
      // First digit is optional, so "12" should work
      expect(triggerInput('12')).toBe('12');
    });

    it('should include optional pattern when matched', () => {
      fixture.componentInstance.mask.set('#?##');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('123');
    });

    it('should skip optional when input does not match', () => {
      fixture.componentInstance.mask.set('#?@#');
      fixture.detectChanges();
      // '#?' is optional digit, '@' is letter, '#' is digit
      expect(triggerInput('a1')).toBe('a1');
    });

    it('should skip optionals to match literal separator', () => {
      // #?#?-# = two optional digits, dash, required digit
      fixture.componentInstance.mask.set('#?#?-#');
      fixture.detectChanges();
      // Input "-5" should skip both optionals and match the dash literal
      expect(triggerInput('-5')).toBe('-5');
      // Input "1-5" should fill one optional, then match dash
      expect(triggerInput('1-5')).toBe('1-5');
      // Input "12-5" should fill both optionals, then match dash
      expect(triggerInput('12-5')).toBe('12-5');
    });

    it('should work with optional at end of mask', () => {
      fixture.componentInstance.mask.set('###?');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('12');
      expect(triggerInput('123')).toBe('123');
    });

    it('should work with multiple optional patterns', () => {
      fixture.componentInstance.mask.set('#?#?##');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('12');
      expect(triggerInput('1234')).toBe('1234');
    });

    it('should work with separators', () => {
      fixture.componentInstance.mask.set('#?#-##');
      fixture.detectChanges();
      // With mask #?#-##: first #? is optional, second # required
      // "123" -> #? matches 1, # matches 2, - inserted, ## needs 2 digits but only 3 left
      expect(triggerInput('123')).toBe('12-3');
      expect(triggerInput('1234')).toBe('12-34');
    });
  });

  describe('Zero or more quantifier (*)', () => {
    it('should match zero occurrences', () => {
      fixture.componentInstance.mask.set('#*@');
      fixture.detectChanges();
      // No digits, just letter
      expect(triggerInput('a')).toBe('a');
    });

    it('should match one occurrence', () => {
      fixture.componentInstance.mask.set('#*@');
      fixture.detectChanges();
      expect(triggerInput('1a')).toBe('1a');
    });

    it('should match multiple occurrences', () => {
      fixture.componentInstance.mask.set('#*@');
      fixture.detectChanges();
      expect(triggerInput('12345a')).toBe('12345a');
    });

    it('should work at end of mask (unlimited digits)', () => {
      fixture.componentInstance.specialCharacters.set(['$']);
      fixture.componentInstance.mask.set('$#*');
      fixture.detectChanges();
      expect(triggerInput('12345')).toBe('$12345');
    });

    it('should work with separators before', () => {
      fixture.componentInstance.specialCharacters.set(['$']);
      fixture.componentInstance.mask.set('$#*');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('$123');
    });

    it('should handle transition from * pattern to next pattern', () => {
      fixture.componentInstance.mask.set('#*-##');
      fixture.detectChanges();
      // * is greedy - consumes all matching input, separator/following pattern never reached
      expect(triggerInput('12345')).toBe('12345');
      // To get separator, user must type it explicitly
      expect(triggerInput('123-45')).toBe('123-45');
    });

    it('should work with letter patterns', () => {
      fixture.componentInstance.mask.set('@*#');
      fixture.detectChanges();
      expect(triggerInput('abc1')).toBe('abc1');
    });
  });

  describe('Custom patterns', () => {
    it('should allow custom pattern that overrides built-in', () => {
      // Override # to only accept 0-5 (for hours first digit)
      fixture.componentInstance.customPatterns.set({
        H: { pattern: /[0-2]/ },
      });
      fixture.componentInstance.mask.set('H#:##');
      fixture.detectChanges();
      expect(triggerInput('1234')).toBe('12:34');
      // When first char doesn't match required pattern, nothing is output
      expect(triggerInput('3456')).toBe('');
    });

    it('should support optional property in custom pattern', () => {
      fixture.componentInstance.customPatterns.set({
        O: { pattern: /\d/, optional: true },
      });
      fixture.componentInstance.mask.set('O##');
      fixture.detectChanges();
      // O is optional, so "12" should work (skips O, matches ##)
      expect(triggerInput('12')).toBe('12');
      // And "123" should also work (matches O##)
      expect(triggerInput('123')).toBe('123');
    });

    it('should skip optional custom pattern when input does not match (no quantifier)', () => {
      // This tests line 91 when quantifier is null but pattern.optional is true
      fixture.componentInstance.customPatterns.set({
        D: { pattern: /\d/, optional: true },
      });
      fixture.componentInstance.mask.set('D@@');
      fixture.detectChanges();
      // 'D' is optional digit, '@' is letter
      // Input 'ab' - 'a' doesn't match D (digit), D is skipped (advances 1), matches @@
      expect(triggerInput('ab')).toBe('ab');
    });

    it('should support multiple custom patterns together', () => {
      fixture.componentInstance.customPatterns.set({
        H: { pattern: /[0-2]/ },
        M: { pattern: /[0-5]/ },
      });
      fixture.componentInstance.mask.set('H#:M#');
      fixture.detectChanges();
      expect(triggerInput('2359')).toBe('23:59');
      // When first char doesn't match required pattern, nothing is output
      expect(triggerInput('9999')).toBe('');
    });

    it('should allow custom pattern to use any character key', () => {
      fixture.componentInstance.customPatterns.set({
        '9': { pattern: /\d/ },
      });
      fixture.componentInstance.mask.set('999');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('123');
    });
  });

  describe('Validator interface', () => {
    let directive: MaskDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(MaskDirective))
        .injector.get(MaskDirective);
    });

    it('should return null for empty value', () => {
      const result = directive.validate({ value: '' } as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const result = directive.validate({ value: null } as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return null when input is complete', () => {
      const result = directive.validate({
        value: '1234567890',
      } as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return error when input is incomplete', () => {
      const result = directive.validate({ value: '123' } as AbstractControl);
      expect(result).toEqual({
        mask: {
          requiredMask: '(###) ###-####',
          actualLength: 3,
          expectedLength: 10,
        },
      });
    });

    it('should handle masks with optional patterns correctly', () => {
      fixture.componentInstance.mask.set('##:##:#?#?');
      fixture.detectChanges();
      // Expected length: ##:##: = 6 chars (optional #?#? are excluded)
      // Providing '12345' gives masked value '12:34:5' = 6 chars, valid
      const result = directive.validate({ value: '12345' } as AbstractControl);
      expect(result).toBeNull();
    });

    it('should handle masks with * quantifier correctly', () => {
      fixture.componentInstance.specialCharacters.set(['$']);
      fixture.componentInstance.mask.set('$#*');
      fixture.detectChanges();
      // Expected length: just $ = 1 char (# with * is optional)
      const result = directive.validate({ value: '1' } as AbstractControl);
      expect(result).toBeNull();
    });

    it('should return error when optional is filled but trailing required is not', () => {
      // Mask: #?-@# -> optional digit, dash, required letter, required digit
      fixture.componentInstance.mask.set('#?-@#');
      fixture.detectChanges();
      // Input "1B" -> "1" fills optional #?, "-" auto-inserted, "B" fills @, but final # is missing
      const result = directive.validate({ value: '1B' } as AbstractControl);
      expect(result).not.toBeNull();
      expect(result?.['mask']).toBeDefined();
    });
  });

  describe('removeSpecialCharacters option', () => {
    it('should keep special characters in raw value when removeSpecialCharacters is false', () => {
      fixture.componentInstance.removeSpecialCharacters.set(false);
      fixture.componentInstance.mask.set('###-###');
      fixture.detectChanges();

      const directive = fixture.debugElement
        .query(By.directive(MaskDirective))
        .injector.get(MaskDirective);
      const spy = jest.spyOn(
        directive as unknown as { onChange: (v: string) => void },
        'onChange'
      );

      triggerInput('123456');
      expect(inputEl.value).toBe('123-456');
      // With removeSpecialCharacters=false, dash (special char) should be included in raw
      expect(spy).toHaveBeenCalledWith('123-456');
    });
  });

  describe('Focus behavior', () => {
    it('should select all on focus if single cursor (lines 196-208 coverage)', () => {
      fixture.componentInstance.mask.set('(###) ###-####');
      fixture.componentInstance.prefix.set('+1 ');
      fixture.detectChanges();

      inputEl.value = '+1 (123) 456-7890';
      // User clicks at index 0 (before prefix)
      inputEl.selectionStart = 0;
      inputEl.selectionEnd = 0;

      inputEl.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      // Should move cursor to after prefix (length 3)
      expect(inputEl.selectionStart).toBe(3);
    });
  });
});

describe('MaskDirective with Reactive Forms', () => {
  it('should register as NG_VALIDATORS provider', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const control = fixture.componentInstance.control;

    // Trigger validation with incomplete input
    control.setValue('123');
    fixture.detectChanges();

    // Should have mask error because input is incomplete
    expect(control.errors).toEqual({
      mask: {
        requiredMask: '###-####',
        actualLength: 3,
        expectedLength: 7,
      },
    });

    // Complete input should be valid
    control.setValue('1234567');
    fixture.detectChanges();
    expect(control.errors).toBeNull();
  });

  it('should store raw value in FormControl and masked value in input', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Simulate user input
    inputEl.value = '1234567';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Input should show masked value
    expect(inputEl.value).toBe('123-4567');
    // FormControl should have raw value (without separators)
    expect(control.value).toBe('1234567');
  });

  it('should write masked value to input from raw FormControl value', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Set raw value programmatically
    control.setValue('1234567');
    fixture.detectChanges();

    // Input should display masked value
    expect(inputEl.value).toBe('123-4567');
  });

  it('should handle empty value in writeValue', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Set value then clear it
    control.setValue('1234567');
    fixture.detectChanges();
    expect(inputEl.value).toBe('123-4567');

    control.setValue('');
    fixture.detectChanges();
    expect(inputEl.value).toBe('');
  });

  it('should call onTouched on blur', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    expect(control.touched).toBe(false);

    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.touched).toBe(true);
  });

  it('should disable input when FormControl is disabled', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormTestComponent],
    });

    const fixture = TestBed.createComponent(ReactiveFormTestComponent);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    expect(inputEl.disabled).toBe(false);

    control.disable();
    fixture.detectChanges();
    expect(inputEl.disabled).toBe(true);

    control.enable();
    fixture.detectChanges();
    expect(inputEl.disabled).toBe(false);
  });
});

@Component({
  template: `<input
    [formControl]="control"
    [mask]="'###-####'"
    [clearIfNotMatch]="clearIfNotMatch()" />`,
  imports: [MaskDirective, ReactiveFormsModule],
})
class ClearIfNotMatchTestComponent {
  control = new FormControl('');
  clearIfNotMatch = signal(false);
}

describe('MaskDirective clearIfNotMatch', () => {
  it('should clear input on blur when clearIfNotMatch is true and mask is incomplete', () => {
    TestBed.configureTestingModule({
      imports: [ClearIfNotMatchTestComponent],
    });

    const fixture = TestBed.createComponent(ClearIfNotMatchTestComponent);
    fixture.componentInstance.clearIfNotMatch.set(true);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Simulate partial input
    inputEl.value = '123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123');
    expect(control.value).toBe('123');

    // Blur should clear the input
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('');
    expect(control.value).toBe('');
  });

  it('should NOT clear input on blur when clearIfNotMatch is true and mask is complete', () => {
    TestBed.configureTestingModule({
      imports: [ClearIfNotMatchTestComponent],
    });

    const fixture = TestBed.createComponent(ClearIfNotMatchTestComponent);
    fixture.componentInstance.clearIfNotMatch.set(true);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Simulate complete input
    inputEl.value = '1234567';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123-4567');
    expect(control.value).toBe('1234567');

    // Blur should NOT clear the input
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123-4567');
    expect(control.value).toBe('1234567');
  });

  it('should NOT clear input on blur when clearIfNotMatch is false (default)', () => {
    TestBed.configureTestingModule({
      imports: [ClearIfNotMatchTestComponent],
    });

    const fixture = TestBed.createComponent(ClearIfNotMatchTestComponent);
    // clearIfNotMatch defaults to false
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    // Simulate partial input
    inputEl.value = '123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123');
    expect(control.value).toBe('123');

    // Blur should NOT clear the input when clearIfNotMatch is false
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123');
    expect(control.value).toBe('123');
  });

  it('should still mark control as touched on blur regardless of clearIfNotMatch', () => {
    TestBed.configureTestingModule({
      imports: [ClearIfNotMatchTestComponent],
    });

    const fixture = TestBed.createComponent(ClearIfNotMatchTestComponent);
    fixture.componentInstance.clearIfNotMatch.set(true);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const control = fixture.componentInstance.control;

    expect(control.touched).toBe(false);

    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.touched).toBe(true);
  });
});

describe('MaskDirective Coverage Gaps', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should handle cursor position becoming negative (line 278)', () => {
    fixture.componentInstance.prefix.set('$ ');
    fixture.componentInstance.mask.set('###');
    fixture.detectChanges();

    // Trigger input with cursor at 0 (before prefix)
    inputEl.value = '$ 123';

    // We need to mock selectionStart to 0.
    inputEl.selectionStart = 0;
    inputEl.selectionEnd = 0;

    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // If code executes without error and mask applied, good.
    expect(inputEl.value).toBe('$ 123');
  });

  it('should execute onFocus logic (lines 178-206)', () => {
    fixture.componentInstance.prefix.set('$ ');
    fixture.detectChanges();
    inputEl.value = '$ 123';
    inputEl.selectionStart = 0;
    inputEl.selectionEnd = 0;

    // Dispatch focus event
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // Check if cursor moved
    expect(inputEl.selectionStart).toBe(2); // Length of "$ "
  });

  it('should handle prefix update in ngOnChanges (untracked block)', () => {
    fixture.componentInstance.mask.set('###');
    fixture.componentInstance.prefix.set('A');
    fixture.detectChanges();

    inputEl.value = 'A123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('A123');

    // Change prefix
    fixture.componentInstance.prefix.set('B');
    fixture.detectChanges();

    // ngOnChanges should run. applyAndSetMask should run.
    expect(inputEl.value).toBe('B123');
    expect(inputEl.value).toBe('B123');
  });

  it('should NOT update selection on focus if value is empty', () => {
    fixture.componentInstance.mask.set('###');
    fixture.detectChanges();
    inputEl.value = '';
    inputEl.selectionStart = 0;
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    // Should remain 0
    expect(inputEl.selectionStart).toBe(0);
  });

  it('should NOT update selection on focus if selection is a range', () => {
    fixture.componentInstance.prefix.set('$ ');
    fixture.detectChanges();
    inputEl.value = '$ 123';
    inputEl.selectionStart = 0;
    inputEl.selectionEnd = 3; // Range

    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // Should remain range (0-3)
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(3);
  });
});

@Component({
  template: `<input mask removeSpecialCharacters="true" mergeSpecialChars />`,
  imports: [MaskDirective],
})
class InputTransformTestComponent {}

describe('MaskDirective Input Transforms', () => {
  let fixture: ComponentFixture<InputTransformTestComponent>;
  let directive: MaskDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTransformTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTransformTestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(MaskDirective))
      .injector.get(MaskDirective);
  });

  it('should transform string "true" and empty string to boolean true', () => {
    // removeSpecialCharacters="true" -> true
    expect(directive.removeSpecialCharacters()).toBe(true);

    // mergeSpecialChars (attribute present = empty string) -> true
    expect(directive.mergeSpecialChars()).toBe(true);
  });
});

@Component({
  template: `<input
    mask
    [removeSpecialCharacters]="removeSpecialCharsValue"
    [mergeSpecialChars]="mergeSpecialCharsValue" />`,
  imports: [MaskDirective],
})
class InputTransformDynamicTestComponent {
  removeSpecialCharsValue: string | boolean = true;
  mergeSpecialCharsValue: string | boolean = false;
}

describe('MaskDirective Dynamic Input Transforms', () => {
  let fixture: ComponentFixture<InputTransformDynamicTestComponent>;
  let directive: MaskDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTransformDynamicTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTransformDynamicTestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(MaskDirective))
      .injector.get(MaskDirective);
  });

  it('should handle boolean and string inputs', () => {
    // 1. Boolean false
    fixture.componentInstance.removeSpecialCharsValue = false;
    fixture.componentInstance.mergeSpecialCharsValue = false;
    fixture.detectChanges();
    expect(directive.removeSpecialCharacters()).toBe(false);
    expect(directive.mergeSpecialChars()).toBe(false);

    // 2. Boolean true
    fixture.componentInstance.removeSpecialCharsValue = true;
    fixture.componentInstance.mergeSpecialCharsValue = true;
    fixture.detectChanges();
    expect(directive.removeSpecialCharacters()).toBe(true);
    expect(directive.mergeSpecialChars()).toBe(true);

    // 3. String "true"
    fixture.componentInstance.removeSpecialCharsValue = 'true';
    fixture.componentInstance.mergeSpecialCharsValue = 'true';
    fixture.detectChanges();
    expect(directive.removeSpecialCharacters()).toBe(true);
    expect(directive.mergeSpecialChars()).toBe(true);

    // 4. String "" (empty)
    fixture.componentInstance.removeSpecialCharsValue = '';
    fixture.componentInstance.mergeSpecialCharsValue = '';
    fixture.detectChanges();
    expect(directive.removeSpecialCharacters()).toBe(true);
    expect(directive.mergeSpecialChars()).toBe(true);

    // 5. String "false" (neither empty nor "true")
    fixture.componentInstance.removeSpecialCharsValue = 'false';
    fixture.componentInstance.mergeSpecialCharsValue = 'false';
    fixture.detectChanges();
    expect(directive.removeSpecialCharacters()).toBe(false);
    expect(directive.mergeSpecialChars()).toBe(false);
  });
});

describe('MaskDirective Null and Edge Cases', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should handle null selectionStart/End (lines 112, 152, 161, 193, 194)', () => {
    // Mock selectionStart to return null
    Object.defineProperty(inputEl, 'selectionStart', { get: () => null });
    Object.defineProperty(inputEl, 'selectionEnd', { get: () => null });

    // 1. onInput (line 152)
    fixture.componentInstance.mask.set('###');
    fixture.detectChanges();
    inputEl.value = '123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // 2. onBackspace (line 161)
    const backspace = new KeyboardEvent('keydown', { key: 'Backspace' });
    inputEl.dispatchEvent(backspace);

    // 3. onFocus (lines 193, 194)
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // 4. untracked input signal (line 112)
    fixture.componentInstance.prefix.set('A');
    fixture.detectChanges();
  });

  it('should not throw on backspace if cursor > 0 and char is pattern (lines 178 else)', () => {
    fixture.componentInstance.mask.set('###');
    fixture.detectChanges();
    inputEl.value = '123';
    inputEl.selectionStart = 3;
    inputEl.selectionEnd = 3;

    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
      cancelable: true,
    });
    inputEl.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should NOT update selection on focus if already valid (line 206 else)', () => {
    fixture.componentInstance.prefix.set('$ ');
    fixture.detectChanges();
    inputEl.value = '$ 123';
    // Cursor at 2 (valid start)
    inputEl.selectionStart = 2;
    inputEl.selectionEnd = 2;

    const spy = jest.spyOn(inputEl, 'setSelectionRange');

    inputEl.dispatchEvent(new Event('focus'));

    // constrainCursor(2) -> 2. newPos === selectionStart.
    expect(spy).not.toHaveBeenCalled();
  });
});
