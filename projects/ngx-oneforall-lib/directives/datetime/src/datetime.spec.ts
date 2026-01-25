import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  control = new FormControl('');
  removeSpecialCharacters = signal(true);
}

@Component({
  template: `<input [dateTime]="format()" [formControl]="control" />`,
  imports: [DateTimeDirective, ReactiveFormsModule],
})
class InitialValueTestComponent {
  format = signal('MM-DD-YYYY');
  control = new FormControl('12252024');
}

describe('DateTimeDirective', () => {
  describe('Standard behavior', () => {
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
        .query(By.directive(DateTimeDirective))
        .injector.get(DateTimeDirective);
      expect(directive).toBeTruthy();
    });

    describe('Format parsing', () => {
      it('should format MM-DD-YYYY correctly', () => {
        expect(triggerInput('12252024')).toBe('12-25-2024');
      });

      it('should handle partial input', () => {
        // After completing DD token, separator is auto-inserted
        expect(triggerInput('1225')).toBe('12-25-');
      });

      it('should reject invalid month (13)', () => {
        expect(triggerInput('13')).toBe('1');
      });

      it('should reject invalid day (32)', () => {
        expect(triggerInput('1232')).toBe('12-3');
      });
    });

    describe('Different formats', () => {
      it('should handle YYYY/MM/DD format', () => {
        fixture.componentInstance.format.set('YYYY/MM/DD');
        fixture.detectChanges();
        expect(triggerInput('20241225')).toBe('2024/12/25');
      });

      it('should handle DD.MM.YYYY format', () => {
        fixture.componentInstance.format.set('DD.MM.YYYY');
        fixture.detectChanges();
        expect(triggerInput('25122024')).toBe('25.12.2024');
      });

      it('should handle time format HH:mm', () => {
        fixture.componentInstance.format.set('HH:mm');
        fixture.detectChanges();
        expect(triggerInput('2359')).toBe('23:59');
      });

      it('should reject invalid first digit for HH:mm (7 is not valid for HH)', () => {
        fixture.componentInstance.format.set('HH:mm');
        fixture.detectChanges();
        const control = fixture.componentInstance.control;
        triggerInput('7');
        // 7 is not a valid first digit for HH (only 0,1,2 allowed)
        expect(inputEl.value).toBe('');
        expect(control.value).toBe('');
      });

      it('should handle HH:mm:ss format', () => {
        fixture.componentInstance.format.set('HH:mm:ss');
        fixture.detectChanges();
        expect(triggerInput('235959')).toBe('23:59:59');
      });
    });

    describe('Validation', () => {
      it('should return error for incomplete input', () => {
        const control = fixture.componentInstance.control;
        control.setValue('12-25');
        fixture.detectChanges();

        expect(control.errors).toBeTruthy();
        expect(control.errors?.['dateTime']).toBeDefined();
      });

      it('should return null for complete valid input', () => {
        const control = fixture.componentInstance.control;
        triggerInput('12252024');
        fixture.detectChanges();

        expect(control.errors).toBeNull();
      });

      it('should reject invalid date (Feb 30)', () => {
        const control = fixture.componentInstance.control;
        triggerInput('02302024');
        fixture.detectChanges();

        expect(control.errors).toBeTruthy();
        expect(control.errors?.['dateTime']?.invalidDate).toBe(true);
      });
    });

    describe('User interaction', () => {
      it('should auto-insert separators', () => {
        expect(triggerInput('12')).toBe('12-');
      });

      it('should accept user-typed separators', () => {
        expect(triggerInput('12-25-2024')).toBe('12-25-2024');
      });
    });

    describe('removeSpecialCharacters', () => {
      it('should emit raw value (without separators) by default', () => {
        const control = fixture.componentInstance.control;
        triggerInput('12252024');
        expect(control.value).toBe('12252024');
      });

      it('should emit formatted value (with separators) when removeSpecialCharacters is false', () => {
        fixture.componentInstance.removeSpecialCharacters.set(false);
        fixture.detectChanges();

        const control = fixture.componentInstance.control;
        triggerInput('12252024');
        expect(control.value).toBe('12-25-2024');
      });

      it('should NOT include excess characters after format is complete', () => {
        fixture.componentInstance.format.set('HH:mm:ss');
        fixture.detectChanges();

        const control = fixture.componentInstance.control;
        // HH:mm:ss expects 6 raw digits, typing more should be rejected
        triggerInput('2342425'); // 7 digits - last one should be rejected
        expect(inputEl.value).toBe('23:42:42');
        expect(control.value).toBe('234242'); // Only 6 digits
      });
    });
  });

  describe('Initial Value', () => {
    it('should format initial value correctly', async () => {
      await TestBed.configureTestingModule({
        imports: [InitialValueTestComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(InitialValueTestComponent);
      fixture.detectChanges();
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      // Should format '12252024' -> '12-25-2024'
      expect(inputEl.value).toBe('12-25-2024');
    });
  });
});
