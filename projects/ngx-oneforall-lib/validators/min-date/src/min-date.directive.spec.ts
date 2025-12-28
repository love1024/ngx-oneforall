import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MinDateDirective } from './min-date.directive';

@Component({
    selector: 'test-min-date-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [minDate]="minDate">
        </form>
    `,
    imports: [FormsModule, MinDateDirective],
    standalone: true
})
class TestMinDateComponent {
    value: string | Date | null = null;
    minDate: string | Date | null = null;
}

describe('MinDateDirective', () => {
    let fixture: ComponentFixture<TestMinDateComponent>;
    let component: TestMinDateComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestMinDateComponent, MinDateDirective, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestMinDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate when minDate is provided', async () => {
        component.minDate = '2023-01-01';
        component.value = '2022-12-31'; // Invalid
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();
        expect(control.errors?.['minDate']).toBeDefined();

        component.value = '2023-01-02'; // Valid
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors).toBeNull();
    });

    it('should update validation when minDate changes', async () => {
        component.minDate = '2023-01-01';
        component.value = '2023-02-01'; // Valid initially
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();

        component.minDate = '2023-03-01'; // Now invalid
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeTruthy();
        expect(control.errors?.['minDate']).toBeDefined();
    });

    it('should disable validation when minDate is null', async () => {
        component.minDate = '2023-01-01';
        component.value = '2022-12-31';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();

        component.minDate = null;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull();
    });
});
