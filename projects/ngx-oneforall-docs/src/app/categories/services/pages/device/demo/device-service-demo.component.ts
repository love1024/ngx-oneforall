import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';
import {
  DeviceService,
  provideDeviceService,
} from 'ngx-oneforall/services/device';

@Component({
  selector: 'lib-device-service-demo',
  standalone: true,
  imports: [CommonModule, NgClass, TitleCasePipe],
  template: `
    <section class="device-demo-container">
      <h2>Device Service Demo</h2>
      <p class="desc">
        The <b>DeviceService</b> provides real-time information about the user's
        device type and orientation.<br />
        Resize your browser or rotate your device to see updates instantly!
      </p>
      <div class="device-info-card">
        <div class="info-row">
          <span class="label">Device Type:</span>
          <span class="value" [ngClass]="deviceType()">{{
            deviceType() | titlecase
          }}</span>
        </div>
        <div class="info-row">
          <span class="label">Orientation:</span>
          <span class="value" [ngClass]="orientation()">{{
            orientation() | titlecase
          }}</span>
        </div>
      </div>
      <div class="tips">
        @if (deviceType() === 'mobile') {
          <span>
            📱 You are on a mobile device.
          </span>
        }
        @if (deviceType() === 'tablet') {
          <span> 💊 You are on a tablet. </span>
        }
        @if (deviceType() === 'desktop') {
          <span>
            🖥️ You are on a desktop.
          </span>
        }
      </div>
    </section>
    `,
  styleUrl: './device-service-demo.component.scss',
  providers: [provideDeviceService()],
})
export class DeviceServiceDemoComponent {
  private deviceService = inject(DeviceService);
  deviceType = computed(
    () => this.deviceService.deviceInfoSignal()?.type ?? 'unknown'
  );
  orientation = computed(
    () => this.deviceService.deviceInfoSignal()?.orientation ?? 'unknown'
  );
}
