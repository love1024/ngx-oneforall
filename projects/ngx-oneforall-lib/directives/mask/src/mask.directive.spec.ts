import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';
import { IConfigPattern } from './mask.config';

@Component({
  template: `<input [mask]="mask()" [customPatterns]="customPatterns()" />`,
  imports: [MaskDirective],
})
class TestHostComponent {
  mask = signal('(###) ###-####');
  customPatterns = signal<Record<string, IConfigPattern>>({});
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
      fixture.componentInstance.mask.set('$#*');
      fixture.detectChanges();
      expect(triggerInput('12345')).toBe('$12345');
    });

    it('should work with separators before', () => {
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
});
