import { Component, signal } from '@angular/core';

import { Subject, of, delay } from 'rxjs';
import { dataPolling } from 'ngx-oneforall/rxjs/data-polling';

interface ServerData {
  timestamp: string;
  value: number;
  status: string;
}

@Component({
  selector: 'app-data-polling-demo',
  standalone: true,
  imports: [],
  template: `
    <div class="demo-container">
      <h3>Data Polling Demo</h3>
      <p>Poll server data every 3 seconds</p>

      <div class="controls">
        <button (click)="startPolling()" [disabled]="isPolling()">
          Start Polling
        </button>
        <button (click)="stopPolling()" [disabled]="!isPolling()">
          Stop Polling
        </button>
      </div>

      @if (isPolling()) {
        <div class="status">
          <div class="status-indicator"></div>
          <span>Polling active...</span>
        </div>
      }

      @if (latestData()) {
        <div class="data-display">
          <h4>Latest Data:</h4>
          <div class="data-item">
            <label>Timestamp:</label>
            <span>{{ latestData()!.timestamp }}</span>
          </div>
          <div class="data-item">
            <label>Value:</label>
            <span>{{ latestData()!.value }}</span>
          </div>
          <div class="data-item">
            <label>Status:</label>
            <span
              class="status-badge"
              [class.active]="latestData()!.status === 'active'">
              {{ latestData()!.status }}
            </span>
          </div>
        </div>
      }

      @if (dataHistory().length > 0) {
        <div class="history">
          <h4>History (last 5):</h4>
          @for (data of dataHistory(); track $index) {
            <div class="history-item">
              <span class="time">{{ data.timestamp }}</span>
              <span class="value">Value: {{ data.value }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './data-polling-demo.component.scss',
})
export class DataPollingDemoComponent {
  trigger = new Subject<void>();
  latestData = signal<ServerData | null>(null);
  dataHistory = signal<ServerData[]>([]);
  isPolling = signal(false);

  startPolling() {
    this.isPolling.set(true);
    this.trigger
      .pipe(
        dataPolling({
          loader: () => this.fetchServerData(),
          interval: 3000,
        })
      )
      .subscribe(data => {
        this.latestData.set(data);
        this.dataHistory.set([data, ...this.dataHistory().slice(0, 5)]);
      });

    this.trigger.next();
  }

  stopPolling() {
    this.isPolling.set(false);
    this.trigger = new Subject<void>();
  }

  private fetchServerData() {
    const data: ServerData = {
      timestamp: new Date().toLocaleTimeString(),
      value: Math.floor(Math.random() * 100),
      status: Math.random() > 0.3 ? 'active' : 'idle',
    };
    return of(data).pipe(delay(500)); // Simulate network delay
  }
}
