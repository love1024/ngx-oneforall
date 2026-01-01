import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatchFieldsValidator } from './match-field.directive';

@Component({
  template: `
    <form #form="ngForm" [matchFields]="['password', 'confirmPassword']">
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
}

describe('MatchFieldsValidator Directive (Group-Level)', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(fakeAsync(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should return null when values match', fakeAsync(() => {
    component.password = 'test123';
    component.confirmPassword = 'test123';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.errors).toBeNull();
  }));

  it('should return error when values do not match', fakeAsync(() => {
    component.password = 'test123';
    component.confirmPassword = 'different';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'test123',
        field2: 'confirmPassword',
        field2Value: 'different',
      },
    });
  }));

  it('should detect error when password changes after matching', fakeAsync(() => {
    component.password = 'test123';
    component.confirmPassword = 'test123';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.errors).toBeNull();

    component.password = 'changed';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.errors).toEqual({
      matchFields: {
        field1: 'password',
        field1Value: 'changed',
        field2: 'confirmPassword',
        field2Value: 'test123',
      },
    });
  }));
});
