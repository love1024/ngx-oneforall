import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaxDateDirective } from './max-date.directive';

@Component({
    selector: 'test-max-date-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [maxDate]="maxDate">
        </form>
    `,
    imports: [FormsModule, MaxDateDirective],
    standalone: true
})
class TestMaxDateComponent {
    value: string | Date | null = null;
    maxDate: string | Date | null = null;
}

describe('MaxDateDirective', () => {
    let fixture: ComponentFixture<TestMaxDateComponent>;
    let component: TestMaxDateComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestMaxDateComponent, MaxDateDirective, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestMaxDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate when maxDate is provided', async () => {
        component.maxDate = '2023-01-01';
        component.value = '2024-12-31'; // Invalid
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();
        expect(control.errors?.['maxDate']).toBeDefined();

        component.value = '2022-01-02'; // Valid
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors).toBeNull();
    });

    it('should update validation when maxDate changes', async () => {
        component.maxDate = '2023-01-01';
        component.value = '2022-02-01'; // Valid initially
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();

        component.maxDate = '2021-03-01'; // Now invalid
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeTruthy();
        expect(control.errors?.['maxDate']).toBeDefined();
    });

    it('should disable validation when maxDate is null', async () => {
        component.maxDate = '2021-01-01';
        component.value = '2022-12-31';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();

        component.maxDate = null;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull();
    });
});
