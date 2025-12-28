import { Component, Renderer2, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoverClassDirective } from './hover-class.directive';

@Component({
  imports: [HoverClassDirective],
  template: `<div
    [hoverClass]="classes()"
    [hoverClassEnabled]="enabled()"></div>`,
})
class TestHostComponent {
  classes = signal('hovered active');
  enabled = signal(true);
}

describe('HoverClassDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostEl: HTMLElement;
  let directive: HoverClassDirective;
  let renderer: Renderer2;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, HoverClassDirective],
      providers: [Renderer2],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    hostEl = fixture.nativeElement.querySelector('div');
    component = fixture.componentInstance;
    directive =
      fixture.debugElement.children[0].injector.get(HoverClassDirective);
    renderer = fixture.debugElement.children[0].injector.get(Renderer2);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should add classes on mouseenter', () => {
    const addClassSpy = jest.spyOn(renderer, 'addClass');
    directive.onMouseEnter();
    expect(addClassSpy).toHaveBeenCalledWith(hostEl, 'hovered');
    expect(addClassSpy).toHaveBeenCalledWith(hostEl, 'active');
  });

  it('should remove classes on mouseleave', () => {
    const removeClassSpy = jest.spyOn(renderer, 'removeClass');
    directive.onMouseLeave();
    expect(removeClassSpy).toHaveBeenCalledWith(hostEl, 'hovered');
    expect(removeClassSpy).toHaveBeenCalledWith(hostEl, 'active');
  });

  it('should add new classes when hoverClass input changes', () => {
    component.classes.set('foo bar');
    fixture.detectChanges();
    directive.onMouseEnter();

    expect(hostEl.classList).toContain('foo');
    expect(hostEl.classList).toContain('bar');
  });

  it('should ignore empty or whitespace-only classes', () => {
    component.classes.set('foo   bar   ');

    fixture.detectChanges();
    directive.onMouseEnter();

    expect(hostEl.classList).toContain('foo');
    expect(hostEl.classList).toContain('bar');
  });

  it('should add classes on mouseenter if enabled', () => {
    const addClassSpy = jest.spyOn(renderer, 'addClass');
    component.enabled.set(true);
    directive.onMouseEnter();
    expect(addClassSpy).toHaveBeenCalledWith(hostEl, 'hovered');
    expect(addClassSpy).toHaveBeenCalledWith(hostEl, 'active');
  });

  it('should not add classes on mouseenter if hoverClassEnabled is false', () => {
    const addClassSpy = jest.spyOn(renderer, 'addClass');
    component.enabled.set(false);
    fixture.detectChanges();
    directive.onMouseEnter();
    expect(addClassSpy).not.toHaveBeenCalled();
    expect(hostEl.classList).not.toContain('hovered');
    expect(hostEl.classList).not.toContain('active');
  });

  it('should remove classes on mouseleave if enabled', () => {
    const removeClassSpy = jest.spyOn(renderer, 'removeClass');
    component.enabled.set(true);
    directive.onMouseLeave();
    expect(removeClassSpy).toHaveBeenCalledWith(hostEl, 'hovered');
    expect(removeClassSpy).toHaveBeenCalledWith(hostEl, 'active');
  });

  it('should not remove classes on mouseleave if hoverClassEnabled is false', () => {
    // When disabled, the effect removes classes automatically
    // onMouseLeave should not add additional removeClass calls
    component.enabled.set(false);
    fixture.detectChanges();

    const removeClassSpy = jest.spyOn(renderer, 'removeClass');
    directive.onMouseLeave();

    // onMouseLeave should not call removeClass when disabled
    expect(removeClassSpy).not.toHaveBeenCalled();
  });
});
