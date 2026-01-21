import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';

@Component({
  template: `<input
    [formControl]="form"
    [mask]="mask()"
    [prefix]="prefix()"
    [suffix]="suffix()" />`,
  imports: [MaskDirective, ReactiveFormsModule],
})
class TestMaskComponent {
  mask = signal('####');
  prefix = signal('');
  suffix = signal('');
  form = new FormControl('');
}

fdescribe('MaskDirective Prefix and Suffix', () => {
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

  describe('Prefix only', () => {
    it('should prepend prefix', () => {
      component.prefix.set('$ ');
      fixture.detectChanges();

      // Initially empty because value is empty
      expect(inputEl.value).toBe('');

      expect(triggerInput('1')).toBe('$ 1');
      expect(triggerInput('12')).toBe('$ 12');
    });

    it('should handle input when user types after prefix', () => {
      component.prefix.set('$ ');
      fixture.detectChanges();
      // Simulating user typing "1" while input is "$ " -> "$ 1"
      inputEl.value = '$ 1';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(inputEl.value).toBe('$ 1');
    });

    it('should restore prefix if user tries to delete it', () => {
      component.prefix.set('$ ');
      fixture.detectChanges();

      triggerInput('123'); // "$ 123"
      inputEl.value = '$ 23'; // Deleted '1'
      inputEl.selectionStart = 2;
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(inputEl.value).toBe('$ 23');

      // Now try to delete prefix
      // If we delete the content, prefix should disappear
      inputEl.value = '$ ';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(inputEl.value).toBe('');
    });
  });

  describe('Suffix only', () => {
    it('should append suffix', () => {
      component.suffix.set(' USD');
      fixture.detectChanges();

      // Initially empty
      expect(inputEl.value).toBe('');

      expect(triggerInput('1')).toBe('1 USD');
      expect(triggerInput('12')).toBe('12 USD');
    });

    it('should constrain cursor before suffix', () => {
      component.suffix.set(' USD');
      fixture.detectChanges();

      inputEl.value = '123 USD';
      inputEl.selectionStart = 10; // Try to set after suffix
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Cursor should be at end of value but before suffix: "123" length is 3. Suffix is " USD".
      // "123 USD" length is 7. 7 - 4 = 3.
      expect(inputEl.selectionStart).toBe(3);
    });

    it('should constrain cursor on click/keyup', () => {
      component.prefix.set('$ ');
      component.suffix.set(' USD');
      fixture.detectChanges();

      inputEl.value = '$ 123 USD';

      // Test 1: Try to click before prefix
      inputEl.selectionStart = 0;
      inputEl.selectionEnd = 0;
      inputEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(inputEl.selectionStart).toBe(2); // Should jump to after "$ "

      // Test 2: Try to click inside suffix
      inputEl.selectionStart = 8; // "$ 123 U" -> Index 7 is '3', 8 is ' '
      inputEl.selectionEnd = 8;
      inputEl.dispatchEvent(new Event('keyup'));
      fixture.detectChanges();
      expect(inputEl.selectionStart).toBe(5); // "$ 123" length is 5. Should jump to after "3"
    });

    it('should maintain suffix when typing', () => {
      component.suffix.set(' USD');
      fixture.detectChanges();
      // user types 1 in front of USD
      inputEl.value = '1 USD';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(inputEl.value).toBe('1 USD');
    });
  });

  describe('Both Prefix and Suffix', () => {
    it('should handle both', () => {
      component.prefix.set('$ ');
      component.suffix.set(' USD');
      fixture.detectChanges();

      expect(inputEl.value).toBe('');

      equal('1', '$ 1 USD');
      equal('12', '$ 12 USD');
      equal('123', '$ 123 USD');
      equal('1234', '$ 1234 USD');
    });
  });

  describe('Raw Value', () => {
    it('should not include prefix/suffix in raw value (form control)', () => {
      component.prefix.set('$');
      component.suffix.set('USD');
      component.mask.set('###');
      fixture.detectChanges();

      triggerInput('123');
      expect(component.form.value).toBe('123');
      expect(inputEl.value).toBe('$123USD');
    });
  });

  describe('Parsing behavior', () => {
    it('should correctly parse inputs that already contain prefix/suffix', () => {
      component.prefix.set('+1 ');
      component.mask.set('(###) ###-####');
      fixture.detectChanges();

      // Simulating re-masking an already masked value
      // "+1 (123) 456-7890" input
      equal('+1 (123) 456-7890', '+1 (123) 456-7890');
    });
  });
});
