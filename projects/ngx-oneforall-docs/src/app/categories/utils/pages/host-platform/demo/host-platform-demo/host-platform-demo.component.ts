import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getHostPlatform } from '@ngx-oneforall/utils';
import { HostPlatform } from '@ngx-oneforall/constants';

@Component({
    selector: 'host-platform-demo',
    template: `
		<div class="demo-container">
			<p><strong>Current Platform:</strong> {{ platform }}</p>
			<p><strong>Is Apple Platform:</strong> {{ isApple }}</p>
		</div>
	`,
    styles: [`
		.demo-container {
			padding: 1rem;
			background: var(--ng-doc-code-block-background);
			border-radius: 4px;
		}
	`],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostPlatformDemoComponent {
    platform = getHostPlatform();

    get isApple(): boolean {
        return this.platform === HostPlatform.MAC || this.platform === HostPlatform.IOS;
    }
}
