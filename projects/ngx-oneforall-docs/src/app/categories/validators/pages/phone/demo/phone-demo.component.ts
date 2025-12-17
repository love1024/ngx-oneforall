import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountryCode, phoneValidator, PhoneValidator } from '@ngx-oneforall/validators';


@Component({
    selector: 'app-phone-demo',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, PhoneValidator],
    template: `
        <div class="demo-container">
            <h3>Reactive Form (US Default)</h3>
            <label>
                Enter US Phone Number:
                <input type="text" [formControl]="control" placeholder="202-555-0125">
            </label>
            
            <div *ngIf="control.errors?.['phone']" class="error">
                Invalid phone number for the selected country (US).
            </div>
            
            <div *ngIf="control.valid && control.value" class="success">
                Valid phone number!
            </div>
        </div>

        <div class="demo-container">
            <h3>Template-Driven Form (Select Country)</h3>
            <label>
                Select Country:
                <select [(ngModel)]="selectedCountry">
                    <option *ngFor="let country of countries" [value]="country.code">{{ country.name }}</option>
                </select>
            </label>
            <label>
                Enter Phone Number:
                <input type="text" [(ngModel)]="templateValue" [phone]="selectedCountry" #templateCtrl="ngModel" placeholder="Type phone number...">
            </label>
            
            <div *ngIf="templateCtrl.errors?.['phone']" class="error">
                Invalid phone number for {{ getCountryName(selectedCountry) }}.
            </div>
            
            <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
                Valid phone number!
            </div>
        </div>
    `,
    styles: [`
        .demo-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid var(--ng-doc-border-color);
            border-radius: 4px;
            margin-bottom: 2rem;
        }
        h3 { margin-top: 0; }
        input, select {
            padding: 0.5rem;
            border: 1px solid var(--ng-doc-border-color);
            border-radius: 4px;
            width: 100%;
            background: var(--ng-doc-input-bg);
            color: var(--ng-doc-text-color);
            margin-top: 0.5rem;
        }
        .error {
            color: #f44336;
            font-size: 0.9rem;
        }
        .success {
            color: #4caf50;
            font-size: 0.9rem;
        }
    `]
})
export class PhoneDemoComponent {
    control = new FormControl(null, phoneValidator("US"));
    templateValue: string | null = null;
    selectedCountry: CountryCode = "US";

    countries = [
        { name: 'United States', code: "US" },
        { name: 'United Kingdom', code: "GB" },
        { name: 'India', code: "IN" },
        { name: 'Germany', code: "DE" },
        { name: 'Australia', code: "AU" }
    ];

    getCountryName(code: CountryCode): string {
        return this.countries.find(c => c.code === code)?.name || code;
    }
}
