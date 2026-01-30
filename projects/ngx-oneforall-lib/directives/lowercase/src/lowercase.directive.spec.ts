import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LowercaseDirective } from './lowercase.directive';

@Component({
  imports: [LowercaseDirective, ReactiveFormsModule],
  template: `
    <input class="bare" type="text" lowercase [updateOutput]="updateOutput" />
    <input
      class="control"
      type="text"
      [formControl]="control"
      lowercase
      [updateOutput]="updateOutput" />
  `,
})
class TestComponent {
  control = new FormControl('');
  updateOutput = true;
}

describe('LowercaseDirective', () => {
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

  it('should transform typed input to lowercase', () => {
    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'HELLO';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('hello');
  });

  it('should transform pasted input to lowercase', () => {
    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'PASTE TEST';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('paste test');
  });

  it('should update form control value to lowercase', () => {
    const inputEl = controlInput.nativeElement as HTMLInputElement;
    inputEl.value = 'FORM VALUE';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('form value');
    expect(inputEl.value).toBe('form value');
  });

  it('should handle programmatic updates via form control', () => {
    component.control.setValue('UPDATE');
    fixture.detectChanges();
    const inputEl = controlInput.nativeElement as HTMLInputElement;

    expect(inputEl.value).toBe('update');
  });

  it('should ONLY apply visual transformation when updateOutput is false', () => {
    // Set updateOutput to false
    component.updateOutput = false;
    fixture.detectChanges();

    const inputEl = bareInput.nativeElement as HTMLInputElement;
    inputEl.value = 'VISUAL ONLY';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Value should remain uppercase
    expect(inputEl.value).toBe('VISUAL ONLY');
    // Visual style should be lowercase
    expect(inputEl.style.textTransform).toBe('lowercase');
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

    component.control.setValue('TEST');
    fixture.detectChanges();
    const inputEl = controlInput.nativeElement as HTMLInputElement;

    expect(inputEl.value).toBe('TEST');
  });
});
