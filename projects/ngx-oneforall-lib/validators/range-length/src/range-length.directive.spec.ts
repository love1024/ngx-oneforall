import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RangeLengthValidator } from './range-length.directive';

@Component({
    selector: 'test-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [rangeLength]="range">
        </form>
    `,
    imports: [FormsModule, RangeLengthValidator],
    standalone: true
})
class TestComponent {
    value: string | null = null;
    range: [number, number] | null = [2, 5];
}

describe('RangeLengthValidator', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, RangeLengthValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate initial value', async () => {
        component.value = 'a'; // Too short
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        expect(control.errors).toEqual({
            rangeLength: {
                requiredMinLength: 2,
                requiredMaxLength: 5,
                actualLength: 1
            }
        });
    });

    it('should be valid when value in range', async () => {
        component.value = 'abc';
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        expect(control.errors).toBeNull();
    });

    it('should react to input changes', async () => {
        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];

        // Valid
        input.nativeElement.value = 'abc';
        input.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors).toBeNull();

        // Invalid (too long)
        input.nativeElement.value = 'abcdef';
        input.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(control.errors?.['rangeLength']).toBeTruthy();
    });

    it('should react to range range changes', async () => {
        component.value = 'abc'; // Length 3, valid for [2, 5]
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();

        // Change range to [4, 6], 'abc' (3) is now invalid
        component.range = [4, 6];
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toEqual({
            rangeLength: {
                requiredMinLength: 4,
                requiredMaxLength: 6,
                actualLength: 3
            }
        });
    });

    it('should disable validation if range is null', async () => {
        component.value = 'a'; // Invalid for [2, 5]
        fixture.detectChanges();
        await fixture.whenStable();

        const input = fixture.debugElement.query(By.css('input'));
        const control = input.injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeTruthy();

        component.range = null; // Disable validation
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull();
    });
});
