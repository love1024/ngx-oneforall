import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RangeValidator } from './range.directive';

@Component({
    selector: 'test-range-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [range]="rangeVal">
        </form>
    `,
    imports: [FormsModule, RangeValidator],
    standalone: true
})
class TestRangeComponent {
    value: number | string | null = null;
    rangeVal: [number, number] | null = [5, 10];
}

describe('RangeValidator Directive', () => {
    let fixture: ComponentFixture<TestRangeComponent>;
    let component: TestRangeComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestRangeComponent, RangeValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate based on range input', async () => {
        component.value = 4; // Invalid < 5
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        expect(control.errors).toEqual({
            range: { min: 5, max: 10, actualValue: 4 }
        });
    });

    it('should be valid when value in range', async () => {
        component.value = 5;
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();

        component.value = 10;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors).toBeNull();
    });

    it('should update validator when range changes', async () => {
        component.value = 4;
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        // Invalid initially
        expect(control.errors).toBeTruthy();

        // Change range to [2, 10]
        component.rangeVal = [2, 10];
        fixture.detectChanges();
        await fixture.whenStable();

        // Should be valid now (4 >= 2)
        expect(control.errors).toBeNull();
    });

    it('should disable validation and return null when range is null', async () => {
        component.value = 4; // Invalid for [5, 10]
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();

        component.rangeVal = null;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull();
    });
});
