import { Component, computed, inject } from '@angular/core';
import { IdleService, provideIdleService } from 'ngx-oneforall/services/idle';

@Component({
  selector: 'app-idle-demo',
  standalone: true,
  providers: [provideIdleService({ timeout: 5000 })],
  template: `
    <div class="demo-container">
      <h3>Idle Detection Demo</h3>
      <p>Stop moving your mouse for 5 seconds to trigger idle state.</p>

      <div class="status" [class.idle]="isIdle()" [class.active]="!isIdle()">
        Status: {{ isIdle() ? 'IDLE 😴' : 'ACTIVE 🟢' }}
      </div>

      <div class="controls">
        <button (click)="start()">Start</button>
        <button (click)="stop()">Stop</button>
        <button (click)="reset()">Reset</button>
      </div>
    </div>
  `,
  styleUrl: './idle-demo.component.scss',
})
export class IdleDemoComponent {
  private idle = inject(IdleService);
  isIdle = computed(() => this.idle.isIdle());

  constructor() {
    this.idle.start();
  }

  start() {
    this.idle.start();
  }

  stop() {
    this.idle.stop();
  }

  reset() {
    this.idle.reset();
  }
}
