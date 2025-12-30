import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { CreditCardValidator } from './credit-card.directive';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'test-credit-card-component',
  template: `
    <form>
      <input name="testInput" [ngModel]="value" creditCard />
    </form>
  `,
  imports: [FormsModule, CreditCardValidator],
  standalone: true,
})
class TestCreditCardComponent {
  value: string | null = null;
}

describe('CreditCardValidator Directive', () => {
  let fixture: ComponentFixture<TestCreditCardComponent>;
  let component: TestCreditCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreditCardComponent, CreditCardValidator, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should validate valid credit card', async () => {
    component.value = '4539148803436574';
    fixture.detectChanges();
    await fixture.whenStable();

    const control = fixture.debugElement
      .query(By.css('input'))
      .injector.get(NgForm).controls['testInput'];
    expect(control.errors).toBeNull();
  });

  it('should invalidate invalid credit card', async () => {
    component.value = '1234567812345678';
    fixture.detectChanges();
    await fixture.whenStable();

    const control = fixture.debugElement
      .query(By.css('input'))
      .injector.get(NgForm).controls['testInput'];
    expect(control.errors).toEqual({ creditCard: { reason: 'luhn_failed' } });
  });
});
