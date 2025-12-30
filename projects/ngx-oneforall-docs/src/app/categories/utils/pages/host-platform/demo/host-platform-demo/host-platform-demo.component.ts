import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getHostPlatform } from '@ngx-oneforall/utils/host-platform';
import { HostPlatform } from '@ngx-oneforall/constants';

@Component({
  selector: 'host-platform-demo',
  template: `
    <div class="demo-container">
      <p><strong>Current Platform:</strong> {{ platform }}</p>
      <p><strong>Is Apple Platform:</strong> {{ isApple }}</p>
    </div>
  `,
  styleUrl: './host-platform-demo.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostPlatformDemoComponent {
  platform = getHostPlatform();

  get isApple(): boolean {
    return (
      this.platform === HostPlatform.MAC || this.platform === HostPlatform.IOS
    );
  }
}
