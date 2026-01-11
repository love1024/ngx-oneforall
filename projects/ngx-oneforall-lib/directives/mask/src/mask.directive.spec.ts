import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';

@Component({
  template: `<input [mask]="mask()" />`,
  imports: [MaskDirective],
})
class TestHostComponent {
  mask = signal('(000) 000-0000');
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

  describe('Basic digit masking (0 pattern)', () => {
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

  describe('Date mask (00/00/0000)', () => {
    beforeEach(() => {
      fixture.componentInstance.mask.set('00/00/0000');
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

  describe('Optional digits (9 pattern)', () => {
    beforeEach(() => {
      fixture.componentInstance.mask.set('(000) 000-00009');
      fixture.detectChanges();
    });

    it('should work without optional digit', () => {
      expect(triggerInput('1234567890')).toBe('(123) 456-7890');
    });

    it('should include optional digit when provided', () => {
      expect(triggerInput('12345678901')).toBe('(123) 456-78901');
    });

    it('should skip optional and continue with next pattern', () => {
      fixture.componentInstance.mask.set('9900');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('12');
    });

    it('should skip multiple optional patterns', () => {
      fixture.componentInstance.mask.set('99900');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('123');
    });

    it('should skip optional pattern when input is non-digit', () => {
      fixture.componentInstance.mask.set('90');
      fixture.detectChanges();
      // 'a' doesn't match optional '9', skip to '0'; 'a' doesn't match '0' either
      expect(triggerInput('a1')).toBe('1');
    });
  });

  describe('Alpha patterns (S, A, U, L)', () => {
    it('should handle letter-only pattern (S)', () => {
      fixture.componentInstance.mask.set('SSS');
      fixture.detectChanges();
      expect(triggerInput('abc')).toBe('abc');
      expect(triggerInput('ABC')).toBe('ABC');
      expect(triggerInput('a1b')).toBe('ab');
    });

    it('should handle alphanumeric pattern (A)', () => {
      fixture.componentInstance.mask.set('A0A 0A0');
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
      fixture.componentInstance.mask.set('00--00');
      fixture.detectChanges();
      expect(triggerInput('1234')).toBe('12--34');
    });

    it('should handle separators at the start', () => {
      fixture.componentInstance.mask.set('---000');
      fixture.detectChanges();
      expect(triggerInput('123')).toBe('---123');
    });
  });

  describe('Edge cases', () => {
    it('should handle mask shorter than input', () => {
      fixture.componentInstance.mask.set('00');
      fixture.detectChanges();
      expect(triggerInput('12345')).toBe('12');
    });

    it('should handle input shorter than mask', () => {
      fixture.componentInstance.mask.set('0000000000');
      fixture.detectChanges();
      expect(triggerInput('12')).toBe('12');
    });

    it('should handle mask ending with separator', () => {
      fixture.componentInstance.mask.set('00-');
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
      fixture.componentInstance.mask.set('000');
      fixture.detectChanges();
      expect(triggerInput('abc')).toBe('');
    });

    it('should handle single character mask', () => {
      fixture.componentInstance.mask.set('0');
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
      fixture.componentInstance.mask.set('0000 0000 0000 0000');
      fixture.detectChanges();
      expect(triggerInput('1234567890123456')).toBe('1234 5678 9012 3456');
    });

    it('should handle time format', () => {
      fixture.componentInstance.mask.set('00:00');
      fixture.detectChanges();
      expect(triggerInput('1234')).toBe('12:34');
    });

    it('should handle SSN format', () => {
      fixture.componentInstance.mask.set('000-00-0000');
      fixture.detectChanges();
      expect(triggerInput('123456789')).toBe('123-45-6789');
    });
  });
});
