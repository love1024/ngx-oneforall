import { Component, EnvironmentInjector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoFocusDirective } from './auto-focus.directive';
import { DOCUMENT } from '@angular/common';

@Component({
  imports: [AutoFocusDirective],
  template: `<input autoFocus />`,
})
class TestHostComponent {}

describe('AutoFocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let directive: AutoFocusDirective;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, AutoFocusDirective],
      providers: [EnvironmentInjector],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
    document = TestBed.inject(DOCUMENT);
    directive =
      fixture.debugElement.children[0].injector.get(AutoFocusDirective);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should focus the element by default as default value is true', () => {
    // Check if active element is the focused one
    expect(document.activeElement).toEqual(inputEl);
  });

  it('should not focus the element if isFocused is false', () => {
    const focusSpy = jest.spyOn(inputEl, 'focus');
    directive.isFocused.set(false);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should set isFocused to true on hostFocused()', () => {
    directive.isFocused.set(false);
    directive.hostFocused();
    expect(directive.isFocused()).toBe(true);
  });

  it('should set isFocused to false on hostBlured()', () => {
    directive.isFocused.set(true);
    directive.hostBlurred();
    expect(directive.isFocused()).toBe(false);
  });

  it('should not call focus on element when isFocused becomes false (else branch)', () => {
    // First blur the element
    inputEl.blur();
    directive.isFocused.set(false);

    // Spy on focus
    const focusSpy = jest.spyOn(inputEl, 'focus');

    // Trigger the effect by changing and accessing the signal
    directive.hostBlurred();
    fixture.detectChanges();

    // Focus should not have been called since isFocused is false
    expect(focusSpy).not.toHaveBeenCalled();
  });
});
