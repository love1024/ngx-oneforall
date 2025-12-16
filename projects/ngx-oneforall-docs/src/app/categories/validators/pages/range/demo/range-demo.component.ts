import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { range, RangeValidator } from '@ngx-oneforall/validators';

@Component({
    selector: 'app-range-demo',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule, RangeValidator],
    template: `
        <div class="demo-container">
            <h3>Reactive Form</h3>
            <label>
                Enter number (5-10):
                <input type="number" [formControl]="control" placeholder="Type here...">
            </label>
            
            <div *ngIf="control.errors?.['range'] as error" class="error">
                Value must be between {{ error.min }} and {{ error.max }}.
                Current: {{ error.actualValue }}
            </div>
            
            <div *ngIf="control.valid && control.value" class="success">
                Valid value!
            </div>
        </div>

        <div class="demo-container">
            <h3>Template-Driven Form (Directive)</h3>
            <label>
                Enter number (10-20):
                <input type="number" [(ngModel)]="templateValue" [range]="[10, 20]" #templateCtrl="ngModel" placeholder="Type here...">
            </label>
            
            <div *ngIf="templateCtrl.errors?.['range'] as error" class="error">
                Value must be between {{ error.min }} and {{ error.max }}.
                Current: {{ error.actualValue }}
            </div>
            
            <div *ngIf="templateCtrl.valid && templateCtrl.value" class="success">
                Valid value!
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
export class RangeDemoComponent {
    control = new FormControl(null, range(5, 10));
    templateValue: number | null = null;
}
