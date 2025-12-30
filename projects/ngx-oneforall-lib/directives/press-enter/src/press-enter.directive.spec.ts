import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PressEnterDirective } from './press-enter.directive';

@Component({
  template: `<input
    pressEnter
    [preventDefault]="prevent"
    (pressEnter)="onEnter()" />`,
  imports: [PressEnterDirective],
})
class TestComponent {
  prevent = true;
  enterPressed = false;

  onEnter() {
    this.enterPressed = true;
  }
}

describe('PressEnterDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, PressEnterDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(
      By.directive(PressEnterDirective)
    );
    expect(directive).toBeTruthy();
  });

  it('should emit pressEnter event on Enter key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');

    inputEl.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.enterPressed).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not emit pressEnter event on other key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space' });
    inputEl.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.enterPressed).toBe(false);
  });

  it('should not call preventDefault when preventDefault input is false', () => {
    component.prevent = false;
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');

    inputEl.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.enterPressed).toBe(true);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
