import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { normalizeKey } from '@ngx-oneforall/utils';

@Component({
    selector: 'normalize-key-demo',
    template: `
		<div class="demo-container">
			<div class="input-group">
				<label>Type any key or modifier:</label>
				<input 
					type="text" 
					[value]="inputValue()"
					(keydown)="onKeydown($event)"
					placeholder="Press any key..."
				/>
			</div>
			
			<div class="result">
				<p><strong>Original Key:</strong> <code>{{ originalKey() }}</code></p>
				<p><strong>Normalized Key:</strong> <code>{{ normalizedKey() }}</code></p>
			</div>

			<div class="examples">
				<h4>Examples:</h4>
				<ul>
					<li><code>space</code> → <code>' '</code></li>
					<li><code>esc</code> → <code>escape</code></li>
					<li><code>up</code> → <code>arrowup</code></li>
					<li><code>meta</code> (on Windows) → <code>control</code></li>
				</ul>
			</div>
		</div>
	`,
    styles: [`
		.demo-container {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
		}
		.input-group {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		input {
			padding: 0.5rem;
			border: 1px solid var(--ng-doc-border-color);
			border-radius: 4px;
			background: var(--ng-doc-input-background);
			color: var(--ng-doc-text-color);
		}
		.result {
			padding: 1rem;
			background: var(--ng-doc-code-block-background);
			border-radius: 4px;
		}
		code {
			background: var(--ng-doc-code-inline-background);
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-family: monospace;
		}
	`],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalizeKeyDemoComponent {
    inputValue = signal('');
    originalKey = signal('');
    normalizedKey = signal('');

    onKeydown(event: KeyboardEvent) {
        event.preventDefault();
        this.inputValue.set(event.key);
        this.originalKey.set(event.key);
        this.normalizedKey.set(normalizeKey(event.key));
    }
}
