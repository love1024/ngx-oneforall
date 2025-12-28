import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateValidator } from './date.directive';

@Component({
    selector: 'test-date-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" date>
        </form>
    `,
    imports: [FormsModule, DateValidator],
    standalone: true
})
class TestDateComponent {
    value: string | Date | null = null;
}

describe('DateValidator Directive', () => {
    let fixture: ComponentFixture<TestDateComponent>;
    let component: TestDateComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestDateComponent, DateValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate valid date string', async () => {
        component.value = '2023-01-01';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();
    });

    it('should invalidate invalid date string', async () => {
        component.value = 'invalid-date';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toEqual({
            date: { actualValue: 'invalid-date' }
        });
    });
});
