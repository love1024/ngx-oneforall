import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PhoneValidator } from './phone.directive';
import { CountryCode } from './phone.validator';


@Component({
    selector: 'test-phone-component',
    template: `
        <form>
            <input name="testInput" [ngModel]="value" [phone]="countryCode">
        </form>
    `,
    imports: [FormsModule, PhoneValidator],
    standalone: true
})
class TestPhoneComponent {
    value: string | null = null;
    countryCode: CountryCode | null = "US";
}

describe('PhoneValidator Directive', () => {
    let fixture: ComponentFixture<TestPhoneComponent>;
    let component: TestPhoneComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestPhoneComponent, PhoneValidator, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestPhoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should validate valid US phone number with default input', async () => {
        component.value = '2025550125';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toBeNull();
    });

    it('should invalidate invalid US phone number', async () => {
        component.value = '123';
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toEqual({ phone: true });
    });

    it('should update validation when country code changes', async () => {
        component.value = '07911 123456'; // Valid UK, Invalid US
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toEqual({ phone: true }); // Default US

        component.countryCode = "GB";
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull(); // Valid UK
    });

    it('should remove validator when country code is cleared', async () => {
        component.value = 'invalid'; // Invalid for US
        fixture.detectChanges();
        await fixture.whenStable();

        const control = fixture.debugElement.query(By.css('input')).injector.get(NgForm).controls['testInput'];
        expect(control.errors).toEqual({ phone: true }); // Default US

        component.countryCode = null;
        fixture.detectChanges();
        await fixture.whenStable();

        expect(control.errors).toBeNull(); // No validator
    });
});
