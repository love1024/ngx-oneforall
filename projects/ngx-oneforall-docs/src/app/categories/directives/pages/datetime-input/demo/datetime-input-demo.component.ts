import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateTimeInputDirective } from 'ngx-oneforall/directives/datetime-input';

@Component({
  selector: 'lib-datetime-input-demo',
  imports: [DateTimeInputDirective, ReactiveFormsModule],
  template: `
    <div class="demo-section">
      <label for="usDate">US Date (MM-DD-YYYY)</label>
      <input
        id="usDate"
        type="text"
        [dateTimeInput]="'MM-DD-YYYY'"
        [formControl]="usDateControl"
        placeholder="MM-DD-YYYY" />
      <div class="info-row">
        <span class="hint">Format: MM-DD-YYYY</span>
        <span class="model">Value: {{ usDateControl.value }}</span>
      </div>
      @if (usDateControl.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Incomplete date' }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="isoDate">ISO Date (YYYY/MM/DD)</label>
      <input
        id="isoDate"
        type="text"
        [dateTimeInput]="'YYYY/MM/DD'"
        [formControl]="isoDateControl"
        placeholder="YYYY/MM/DD" />
      <div class="info-row">
        <span class="hint">Format: YYYY/MM/DD</span>
        <span class="model">Value: {{ isoDateControl.value }}</span>
      </div>
      @if (isoDateControl.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Incomplete date' }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="minMaxDate">Min/Max Date Validation</label>
      <input
        id="minMaxDate"
        type="text"
        [dateTimeInput]="'MM-DD-YYYY'"
        [min]="minDate"
        [max]="maxDate"
        [formControl]="minMaxControl"
        placeholder="MM-DD-YYYY" />
      <div class="info-row">
        <span class="hint">Min: 01/01/2024, Max: 12/31/2024</span>
        <span class="model">Value: {{ minMaxControl.value }}</span>
      </div>
      @if (minMaxControl.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Invalid date' }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="keepSeparators">Keep Separators (for parsing)</label>
      <input
        id="keepSeparators"
        type="text"
        [dateTimeInput]="'YYYY-MM-DD'"
        [removeSpecialCharacters]="false"
        [formControl]="keepSeparatorsControl"
        placeholder="YYYY-MM-DD" />
      <div class="info-row">
        <span class="hint">removeSpecialCharacters: false</span>
        <span class="model">Value: {{ keepSeparatorsControl.value }}</span>
      </div>
      <div class="info-row">
        <span class="hint">new Date(value): {{ parsedDate }}</span>
      </div>
      @if (keepSeparatorsControl.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Incomplete date' }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="time12">12-Hour Time (hh:mm)</label>
      <input
        id="time12"
        type="text"
        [dateTimeInput]="'hh:mm'"
        [formControl]="time12Control"
        placeholder="hh:mm" />
      <div class="info-row">
        <span class="hint">Format: hh:mm (01-12)</span>
        <span class="model">Value: {{ time12Control.value }}</span>
      </div>
      @if (time12Control.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Incomplete time' }}</span>
      }
    </div>

    <div class="demo-section">
      <label for="fullTime">Full Time (HH:mm:ss)</label>
      <input
        id="fullTime"
        type="text"
        [dateTimeInput]="'HH:mm:ss'"
        [formControl]="fullTimeControl"
        placeholder="HH:mm:ss" />
      <div class="info-row">
        <span class="hint">Format: HH:mm:ss</span>
        <span class="model">Value: {{ fullTimeControl.value }}</span>
      </div>
      @if (fullTimeControl.errors?.['dateTimeInput']; as error) {
        <span class="error">{{ error.message || 'Incomplete time' }}</span>
      }
    </div>
  `,
  styleUrl: 'datetime-input-demo.component.scss',
})
export class DateTimeInputDemoComponent {
  usDateControl = new FormControl('');
  isoDateControl = new FormControl('');
  minMaxControl = new FormControl('');
  keepSeparatorsControl = new FormControl('');
  time12Control = new FormControl('');
  fullTimeControl = new FormControl('');

  // Min/Max dates for validation
  minDate = new Date(2024, 0, 1); // Jan 1, 2024
  maxDate = new Date(2024, 11, 31); // Dec 31, 2024

  // Computed parsed date for demonstration
  get parsedDate(): string {
    const value = this.keepSeparatorsControl.value;
    if (!value || value.length < 10) return 'N/A';
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? 'Invalid' : date.toLocaleDateString();
    } catch {
      return 'Invalid';
    }
  }
}
