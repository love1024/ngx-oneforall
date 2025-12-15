import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MinValidator } from './min.directive';

@Component({
    selector: 'test-min-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [min]="minVal">
        </form>
    `,
    imports: [FormsModule, MinValidator],
    standalone: true
})
class TestMinComponent {
    value: number | string | null = null;
    minVal: number | null = 5;
}

describe('MinValidator Directive', () => {
    let fixture: ComponentFixture<TestMinComponent>;
    let component: TestMinComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestMinComponent, MinValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestMinComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate based on min input', async () => {
        component.value = 3; // Invalid < 5
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        expect(control.errors).toEqual({
            min: {
                requiredValue: 5,
                actualValue: 3
            }
        });
    });

    it('should be valid if value >= min', async () => {
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

    it('should update validator when min changes', async () => {
        component.value = 3;
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        // Invalid initially
        expect(control.errors).toBeTruthy();

        // Change min to 2
        component.minVal = 2;
        fixture.detectChanges();
        await fixture.whenStable();

        // Should be valid now (3 >= 2)
        expect(control.errors).toBeNull();
    });

    it('should disable validation and return null when min is null', async () => {
        component.value = 3; // Invalid for min 5
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        // Confirm invalid
        expect(control.errors).toBeTruthy();

        // Set min to null (Trigger line 26: this.validator = null)
        component.minVal = null;
        fixture.detectChanges();
        await fixture.whenStable();

        // Confirm valid (Trigger line 35 branch: this.validator is null)
        expect(control.errors).toBeNull();
    });

    it('should register onChange', () => {
        // Line 39 coverage implicitly, but explicit test ensures function is assigned
        const directive = fixture.debugElement.query(By.directive(MinValidator)).injector.get(MinValidator);
        const fn = jest.fn();
        directive.registerOnValidatorChange!(fn);

        // Trigger change
        fixture.componentInstance.minVal = 10;
        fixture.detectChanges(); // Trigger effect

        // Effect calls onChange on line 29
        expect(fn).toHaveBeenCalled();
    });
});
