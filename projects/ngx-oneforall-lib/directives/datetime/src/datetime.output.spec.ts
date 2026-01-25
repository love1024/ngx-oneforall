import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateTimeDirective, DateTimeParts } from './datetime.directive';

@Component({
  template: `<input
    [dateTime]="format()"
    [formControl]="control"
    (dateTimeChanged)="onDateTimeChanged($event)" />`,
  imports: [DateTimeDirective, ReactiveFormsModule],
})
class TestHostComponent {
  format = signal('MM-DD-YYYY HH:mm:ss');
  control = new FormControl('');
  lastEmittedParts: DateTimeParts | null = null;

  onDateTimeChanged(parts: DateTimeParts) {
    this.lastEmittedParts = parts;
  }
}

describe('DateTimeDirective Output', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should emit dateTimeChanged with correct parts for full date time', () => {
    inputEl.value = '12-25-2024 14:30:45';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.lastEmittedParts).toBeTruthy();
    expect(component.lastEmittedParts).toEqual({
      day: '25',
      month: '12',
      year: '2024',
      hour: '14',
      minute: '30',
      second: '45',
      dayPeriod: null,
    });
  });

  it('should emit nulls for missing parts', () => {
    component.format.set('MM-DD');
    fixture.detectChanges();

    inputEl.value = '12-25';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.lastEmittedParts).toEqual({
      day: '25',
      month: '12',
      year: null,
      hour: null,
      minute: null,
      second: null,
      dayPeriod: null,
    });
  });

  it('should emit AM/PM correctly', () => {
    component.format.set('hh:mm A');
    fixture.detectChanges();

    inputEl.value = '02:30 PM';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.lastEmittedParts).toEqual({
      day: null,
      month: null,
      year: null,
      hour: '02',
      minute: '30',
      second: null,
      dayPeriod: 'PM',
    });
  });

  it('should handle partial input gracefully (return null for incomplete parts if implemented that way)', () => {
    // Current impl requires full token length to emit value
    component.format.set('YYYY');
    fixture.detectChanges();

    inputEl.value = '202';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // 202 is length 3, YYYY expects 4. Should be null.
    expect(component.lastEmittedParts?.year).toBeNull();

    inputEl.value = '2024';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.lastEmittedParts?.year).toBe('2024');
  });
});
