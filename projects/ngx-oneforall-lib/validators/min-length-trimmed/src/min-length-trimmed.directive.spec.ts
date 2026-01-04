import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MinLengthTrimmedValidator } from './min-length-trimmed.directive';

@Component({
  template: `
    <form>
      <input
        type="text"
        name="test"
        [(ngModel)]="value"
        [minLengthTrimmed]="3" />
    </form>
  `,
  imports: [FormsModule, MinLengthTrimmedValidator],
})
class TestHostComponent {
  value: string | null = null;
}

describe('MinLengthTrimmedValidator Directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should be valid for null value', async () => {
    component.value = null;
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(true);
  });

  it('should be valid when trimmed length meets minimum', async () => {
    component.value = '  abc  ';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(true);
  });

  it('should be invalid when trimmed length is below minimum', async () => {
    component.value = '  ab  ';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(false);
  });

  it('should be invalid for whitespace-only string', async () => {
    component.value = '     ';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(false);
  });
});
