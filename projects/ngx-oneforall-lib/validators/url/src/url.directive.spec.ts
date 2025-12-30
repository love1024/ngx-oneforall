import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UrlValidator } from './url.directive';
import { UrlValidatorOptions } from './url.validator';

@Component({
  selector: 'test-url-component',
  template: `
    <form>
      <input name="testInput" [ngModel]="value" [url]="options" />
    </form>
  `,
  imports: [FormsModule, UrlValidator],
  standalone: true,
})
class TestUrlComponent {
  value: string | null = null;
  options: UrlValidatorOptions | undefined | null = null;
}

describe('UrlValidator Directive', () => {
  let fixture: ComponentFixture<TestUrlComponent>;
  let component: TestUrlComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestUrlComponent, UrlValidator, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should validate absolute URL by default', async () => {
    component.value = 'invalid';
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input'));
    const control = input.injector.get(NgForm).controls['testInput'];

    expect(control.errors).toBeTruthy();

    component.value = 'https://valid.com';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(control.errors).toBeNull();
  });

  it('should update validation when options change', async () => {
    component.value = 'http://site.com';
    fixture.detectChanges();
    await fixture.whenStable();

    const control = fixture.debugElement
      .query(By.css('input'))
      .injector.get(NgForm).controls['testInput'];

    // Valid by default (http is valid protocol if no protocols specified)
    expect(control.errors).toBeNull();

    // Restrict to https
    component.options = { protocols: ['https'] };
    fixture.detectChanges();
    await fixture.whenStable();

    // Now invalid because http != https
    expect(control.errors).toEqual({
      url: {
        reason: 'invalid_protocol',
        protocols: ['https'],
        actualProtocol: 'http',
      },
    });
  });
});
