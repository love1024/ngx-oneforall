import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { url, UrlValidator, UrlValidatorOptions } from '@ngx-oneforall/validators';

@Component({
    selector: 'app-url-demo',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, UrlValidator],
    template: `
        <div class="demo-container">
            <h3>Reactive Form (Strict Absolute)</h3>
            <label>
                Enter absolute URL (e.g. https://google.com):
                <input type="text" [formControl]="control" placeholder="https://...">
            </label>
            
            <div *ngIf="control.errors?.['url'] as error" class="error">
                Invalid URL. Actual: {{ error.actualValue }}
            </div>
            
            <div *ngIf="control.valid && control.value" class="success">
                Valid URL!
            </div>
        </div>

        <div class="demo-container">
            <h3>Template-Driven (Protocol Optional)</h3>
            <label>
                Enter URL (e.g. google.com or https://google.com):
                <input type="text" [(ngModel)]="templateValue" [url]="options" #templateCtrl="ngModel" placeholder="google.com">
            </label>
            
            <div *ngIf="templateCtrl.errors?.['url'] as error" class="error">
                Invalid URL.
            </div>
            
            <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
                Valid URL!
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
        input {
            padding: 0.5rem;
            border: 1px solid var(--ng-doc-border-color);
            border-radius: 4px;
            width: 100%;
            background: var(--ng-doc-input-bg);
            color: var(--ng-doc-text-color);
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
export class UrlDemoComponent {
    control = new FormControl(null, url());
    templateValue: string | null = null;
    options: UrlValidatorOptions = { skipProtocol: true };
}
