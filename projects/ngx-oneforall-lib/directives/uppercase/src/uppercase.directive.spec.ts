import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  imports: [UppercaseDirective, ReactiveFormsModule],
  template: `
    <input class="bare" type="text" uppercase [updateOutput]="updateOutput" />
    <input
      class="control"
      type="text"
      [formControl]="control"
      uppercase
      [updateOutput]="updateOutput" />
  `,
})
class TestComponent {
  control = new FormControl('');
  updateOutput = true;
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let bareInput: DebugElement;
  let controlInput: DebugElement;
  let component: TestComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bareInput = fixture.debugElement.query(By.css('.bare'));
    controlInput = fixture.debugElement.query(By.css('.control'));
  });

  it('should transform typed input to uppercase', () => {
    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'hello';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('HELLO');
  });

  it('should transform pasted input to uppercase', () => {
    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'paste test';
    inputEl.dispatchEvent(new Event('input')); // Paste triggers input event usually
    fixture.detectChanges();

    expect(inputEl.value).toBe('PASTE TEST');
  });

  it('should update form control value to uppercase', () => {
    const inputEl = controlInput.nativeElement as HTMLInputElement;
    inputEl.value = 'form value';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('FORM VALUE');
    expect(inputEl.value).toBe('FORM VALUE');
  });

  it('should handle programmatic updates via form control', () => {
    component.control.setValue('update');
    fixture.detectChanges();
    const inputEl = controlInput.nativeElement as HTMLInputElement;

    // The directive listens to valueChanges, so it should transform the view value
    // NOTE: Reactive forms distinctUntilChanged might prevent echo updates if transformed value matches
    expect(inputEl.value).toBe('UPDATE');
  });

  it('should ONLY apply visual transformation when updateOutput is false', () => {
    // Set updateOutput to false
    component.updateOutput = false;
    fixture.detectChanges();

    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'visual only';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Value should remain lowercase
    expect(inputEl.value).toBe('visual only');
    // Visual style should be uppercase
    expect(inputEl.style.textTransform).toBe('uppercase');
  });

  it('should not transform when value is empty', () => {
    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('');
  });

  it('should not transform value on valueChanges if updateOutput is false', () => {
    component.updateOutput = false;
    fixture.detectChanges();

    component.control.setValue('test');
    fixture.detectChanges();
    const inputEl = controlInput.nativeElement as HTMLInputElement;

    expect(inputEl.value).toBe('test');
  });
});
