import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NumberValidator } from './number.directive';

@Component({
    selector: 'test-number-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" number>
        </form>
    `,
    imports: [FormsModule, NumberValidator],
    standalone: true
})
class TestNumberComponent {
    value: number | string | null = null;
}

describe('NumberValidator Directive', () => {
    let fixture: ComponentFixture<TestNumberComponent>;
    let component: TestNumberComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestNumberComponent, NumberValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestNumberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate numeric input', async () => {
        component.value = 'abc'; // Invalid
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        expect(control.errors).toEqual({
            number: { actualValue: 'abc' }
        });
    });

    it('should be valid for valid numbers', async () => {
        component.value = 123;
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();

        component.value = '456';
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors).toBeNull();
    });
});
