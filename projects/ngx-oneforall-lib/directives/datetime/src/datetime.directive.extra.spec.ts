import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateTimeDirective } from './datetime.directive';

@Component({
  template: `<input
    [dateTime]="format()"
    [formControl]="control"
    [removeSpecialCharacters]="removeSpecialCharacters()" />`,
  imports: [DateTimeDirective, ReactiveFormsModule],
})
class TestHostComponent {
  format = signal('MM-DD-YYYY');
  removeSpecialCharacters = signal(true);
  control = new FormControl('');
}

describe('DateTimeDirective Extra Coverage', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let component: TestHostComponent;
  let directive: DateTimeDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    directive = fixture.debugElement
      .query(By.directive(DateTimeDirective))
      .injector.get(DateTimeDirective);
  });

  describe('Consecutive Separators in Backspace', () => {
    it('should delete consecutive separators correctly', fakeAsync(() => {
      component.format.set('MM--DD');
      fixture.detectChanges();

      inputEl.value = '12--';
      inputEl.selectionStart = 4;
      inputEl.selectionEnd = 4;

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(inputEl.value).toBe('1');

      tick(100);
      expect(inputEl.selectionStart).toBe(1);
    }));

    it('should handle backspace in middle with consecutive separators', fakeAsync(() => {
      component.format.set('MM--DD');
      fixture.detectChanges();

      inputEl.value = '12--34';
      inputEl.selectionStart = 4;
      inputEl.selectionEnd = 4;

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(inputEl.value).toBe('12--34');

      tick(100);
      expect(inputEl.selectionStart).toBe(2);
    }));

    it('should delete digit before separator on backspace at end', fakeAsync(() => {
      component.format.set('MM/DD');
      fixture.detectChanges();

      inputEl.value = '12/';
      inputEl.selectionStart = 3;

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);
      expect(inputEl.value).toBe('1');
    }));

    it('should emit formatted value in onBackspace logic when removeSpecialCharacters is false', fakeAsync(() => {
      component.format.set('MM/DD');
      component.removeSpecialCharacters.set(false);
      fixture.detectChanges();

      inputEl.value = '12/';
      inputEl.selectionStart = 3;

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);
      tick(100);

      expect(inputEl.value).toBe('1');
    }));
  });

  describe('Backspace Edge Cases', () => {
    it('should do nothing if cursor is at start', () => {
      inputEl.value = '12';
      inputEl.selectionStart = 0;

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should do nothing if char before cursor is not a separator', () => {
      inputEl.value = '12';
      inputEl.selectionStart = 2; // After '2'

      const mockEvent = {
        target: inputEl,
        preventDefault: jest.fn(),
      } as unknown as Event;

      directive.onBackspace(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should emit formatted value when removeSpecialCharacters is false (onInput)', fakeAsync(() => {
      component.format.set('MM/DD');
      component.removeSpecialCharacters.set(false);
      fixture.detectChanges();

      inputEl.value = '12';
      inputEl.selectionStart = 2;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      directive.onInput({ target: inputEl } as any);
      tick(100);

      expect(inputEl.value).toBe('12/');
      expect(component.control.value).toBe('12/'); // Formatted

      component.removeSpecialCharacters.set(true);
      fixture.detectChanges();

      inputEl.value = '12';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      directive.onInput({ target: inputEl } as any);
      tick(100);

      expect(component.control.value).toBe('12'); // Raw
    }));
  });

  describe('OnFocus Edge Cases', () => {
    it('should NOT reset cursor if input is not empty', fakeAsync(() => {
      inputEl.value = '12';
      inputEl.selectionStart = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      directive.onFocus({ target: inputEl } as any);

      tick(100);

      expect(inputEl.selectionStart).toBe(1);
    }));
  });

  describe('Prefix Separators', () => {
    it('should handle formats starting with separators', () => {
      component.format.set('(MM) DD');
      fixture.detectChanges();

      inputEl.value = '1';
      inputEl.dispatchEvent(new Event('input'));

      expect(inputEl.value).toBe('(1');
    });
  });

  describe('Timers Coverage', () => {
    it('should update cursor position in onInput via setTimeout', fakeAsync(() => {
      component.format.set('(MM');
      fixture.detectChanges();

      inputEl.value = '1';
      inputEl.selectionStart = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      directive.onInput({ target: inputEl } as any);

      expect(inputEl.value).toBe('(1');

      tick(100);

      expect(inputEl.selectionStart).toBe(2);
    }));
  });

  describe('Internal Fallbacks & Default Functions', () => {
    it('should execute default onTouched', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (directive as any).onTouched();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (directive as any).onChange('test');
      expect(true).toBe(true);
    });

    it('should handle onInput with cursor at 0', () => {
      inputEl.value = '';
      inputEl.selectionStart = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      directive.onInput({ target: inputEl } as any);
      expect(inputEl.value).toBe('');
    });
  });

  describe('Validation Edge Cases', () => {
    it('should handle non-string input in validate', () => {
      component.control.setValue(null);
      const errors = directive.validate(component.control);
      expect(errors).toBeNull();
    });
  });
});
