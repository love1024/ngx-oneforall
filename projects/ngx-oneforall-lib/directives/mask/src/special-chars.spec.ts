import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';

@Component({
  selector: 'lib-test-special-chars',
  standalone: true,
  imports: [MaskDirective, ReactiveFormsModule],
  template: `
    <input
      [mask]="mask()"
      [specialCharacters]="specialCharacters()"
      [removeSpecialCharacters]="removeSpecialCharacters()"
      [mergeSpecialChars]="mergeSpecialChars()"
      [formControl]="control" />
  `,
})
class TestSpecialCharsComponent {
  control = new FormControl('');
  mask = input.required<string>();
  specialCharacters = input<string[]>();
  removeSpecialCharacters = input(true);
  mergeSpecialChars = input(false);
}

describe('MaskDirective Special Characters', () => {
  let fixture: ComponentFixture<TestSpecialCharsComponent>;
  let component: TestSpecialCharsComponent;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaskDirective, TestSpecialCharsComponent],
    });
    fixture = TestBed.createComponent(TestSpecialCharsComponent);
    component = fixture.componentInstance;
    // Set initial required input
    fixture.componentRef.setInput('mask', '');
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  function triggerInput(value: string): string {
    inputEl.value = value;
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return component.control.value ?? '';
  }

  it('should exclude default special characters from raw value', () => {
    // Default special chars
    const defaultSpecialChars = [
      '-',
      '/',
      '(',
      ')',
      '.',
      ':',
      ' ',
      '+',
      ',',
      '@',
      '[',
      ']',
      '"',
      "'",
    ];
    fixture.componentRef.setInput('mask', '(###) ###-####');
    fixture.componentRef.setInput('specialCharacters', defaultSpecialChars);
    fixture.detectChanges();

    triggerInput('1234567890');

    expect(inputEl.value).toBe('(123) 456-7890');
    // Raw value should NOT contain '(', ')', ' ', '-'
    expect(component.control.value).toBe('1234567890');
  });

  it('should exclude specified special characters', () => {
    fixture.componentRef.setInput('mask', 'A/A');
    fixture.componentRef.setInput('specialCharacters', ['/']);
    fixture.detectChanges();

    triggerInput('12');

    expect(inputEl.value).toBe('1/2');
    // Raw value should NOT contain '/'
    expect(component.control.value).toBe('12');
  });

  it('should handle mixed special characters', () => {
    fixture.componentRef.setInput('mask', 'A-A/A');
    // Both '-' and '/' must be in specialCharacters to pass validation
    fixture.componentRef.setInput('specialCharacters', ['-', '/']);
    fixture.detectChanges();

    triggerInput('123');

    expect(inputEl.value).toBe('1-2/3');
    // Default Mode (remove=true): Removes characters in the list.
    // Since ALL literals must be in the list, ALL literals are removed.
    expect(component.control.value).toBe('123');
  });

  it('should include ONLY specified special characters when removeSpecialCharacters is false', () => {
    // Mask has '(', ')', ' ', '-'
    // specialCharacters (default) has ALL of them.
    // So removing=false means keep ALL of them.

    fixture.componentRef.setInput('mask', '(###) ###-####');
    fixture.componentRef.setInput('removeSpecialCharacters', false);
    // explicit default just to be sure
    const defaultSpecialChars = [
      '-',
      '/',
      '(',
      ')',
      '.',
      ':',
      ' ',
      '+',
      ',',
      '@',
      '[',
      ']',
      '"',
      "'",
    ];
    fixture.componentRef.setInput('specialCharacters', defaultSpecialChars);
    fixture.detectChanges();

    triggerInput('1234567890');

    expect(inputEl.value).toBe('(123) 456-7890');
    // Raw value should include everything because they are all special
    expect(component.control.value).toBe('(123) 456-7890');
  });

  // "should exclude non-special literals" is now covered by the Error test,
  // as non-special literals trigger an Error.

  it('should throw error if mask contains character NOT in specialCharacters', () => {
    fixture.componentRef.setInput('mask', 'A-A');
    // '-' is NOT in specialCharacters
    fixture.componentRef.setInput('specialCharacters', ['/']);

    expect(() => fixture.detectChanges()).toThrow(
      "Mask contains non-pattern character '-' which is not in specialCharacters list."
    );
  });

  it('should display error if mergeSpecialChars is false (defaultValue) and chars are missing', () => {
    fixture.componentRef.setInput('mask', 'A-A');
    fixture.componentRef.setInput('specialCharacters', ['/']);
    // mergeSpecialChars is false by default

    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should NOT throw error if mergeSpecialChars is true and missing char is in DEFAULT list', () => {
    fixture.componentRef.setInput('mask', 'A-A');
    fixture.componentRef.setInput('specialCharacters', ['*']); // junk
    fixture.componentRef.setInput('mergeSpecialChars', true);

    // '-' IS in DEFAULT list. So merging should make effective list include '-'.
    // So validation should PASS.
    expect(() => fixture.detectChanges()).not.toThrow();

    triggerInput('12');
    expect(inputEl.value).toBe('1-2');
  });
});
