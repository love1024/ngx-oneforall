import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NotBlankValidator } from './not-blank.directive';

@Component({
  template: `
    <form>
      <input type="text" name="test" [(ngModel)]="value" notBlank />
    </form>
  `,
  imports: [FormsModule, NotBlankValidator],
})
class TestHostComponent {
  value: string | null = null;
}

describe('NotBlankValidator Directive', () => {
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

  it('should be valid for non-blank string', async () => {
    component.value = 'hello';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(true);
  });

  it('should be invalid for empty string', async () => {
    component.value = '';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(false);
  });

  it('should be invalid for whitespace-only string', async () => {
    component.value = '   ';
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(NgForm));
    expect(form.injector.get(NgForm).valid).toBe(false);
  });
});
