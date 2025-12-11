import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { throttledSignal } from '@ngx-oneforall/signals';

@Component({
    selector: 'app-throttled-signal-demo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="demo-container">
            <div class="input-group">
                <label>Move your mouse over this area:</label>
                <div 
                    class="mouse-area" 
                    (mousemove)="updateCoordinates($event)">
                    Move Here
                </div>
            </div>
            
            <div class="results">
                <p><strong>Actual Coordinates:</strong> {{ coords() }}</p>
                <p><strong>Throttled (500ms):</strong> {{ throttledCoords() }}</p>
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
        }
        .mouse-area {
            width: 100%;
            height: 100px;
            background: var(--ng-doc-input-bg);
            border: 1px dashed var(--ng-doc-border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: crosshair;
        }
    `]
})
export class ThrottledSignalDemoComponent {
    coords = signal('0, 0');
    throttledCoords = throttledSignal(this.coords, 500);

    updateCoordinates(event: MouseEvent) {
        this.coords.set(`${event.offsetX}, ${event.offsetY}`);
    }
}
