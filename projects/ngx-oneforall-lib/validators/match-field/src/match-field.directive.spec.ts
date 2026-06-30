import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatchFieldsValidator } from './match-field.directive';

@Component({
  template: `
    <form #form="ngForm" [matchFields]="matchFieldsArr">
      <input type="password" name="password" [(ngModel)]="password" />
      <input
        type="password"
        name="confirmPassword"
        [(ngModel)]="confirmPassword" />
    </form>
  `,
  imports: [FormsModule, MatchFieldsValidator],
})
class TestComponent {
  @ViewChild('form') form!: NgForm;
  password = '';
  confirmPassword = '';
  matchFieldsArr: [string, string] = ['password', 'confirmPassword'];
}

describe('MatchFieldsValidator Directive (Group-Level)', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should return null when values match', () => {
    const form = component.form.form;
    form.controls['password'].setValue('test123');
    form.controls['confirmPassword'].setValue('test123');

    // Trigger validation
    form.updateValueAndValidity();

    expect(form.errors).toBeNull();
  });

  it('should return error when values do not match', () => {
    const form = component.form.form;
    form.controls['password'].setValue('test123');
    form.controls['confirmPassword'].setValue('different');

    // Trigger validation
    form.updateValueAndValidity();

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'test123',
        field2: 'confirmPassword',
        field2Value: 'different',
      },
    });
  });

  it('should detect error when password changes after matching', () => {
    const form = component.form.form;
    form.controls['password'].setValue('test123');
    form.controls['confirmPassword'].setValue('test123');

    form.updateValueAndValidity();
    expect(form.errors).toBeNull();

    form.controls['password'].setValue('changed');
    form.updateValueAndValidity();

    expect(form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'changed',
        field2: 'confirmPassword',
        field2Value: 'test123',
      },
    });
  });
});
