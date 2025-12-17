import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of, delay } from 'rxjs';
import { dataPolling } from '@ngx-oneforall/rxjs';

interface ServerData {
    timestamp: string;
    value: number;
    status: string;
}

@Component({
    selector: 'app-data-polling-demo',
    standalone: true,
    imports: [CommonModule],
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
                        <span class="status-badge" [class.active]="latestData()!.status === 'active'">
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
    styles: [`
        .demo-container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        h3 {
            margin-top: 0;
            color: #333;
        }

        .controls {
            margin: 20px 0;
            display: flex;
            gap: 10px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }

        button:hover:not(:disabled) {
            background: #0056b3;
        }

        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .status {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #28a745;
            margin: 15px 0;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #28a745;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .data-display {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 4px;
        }

        .data-display h4 {
            margin-top: 0;
        }

        .data-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }

        .data-item:last-child {
            border-bottom: none;
        }

        .data-item label {
            font-weight: 600;
           color: #666;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            background: #ffc107;
            color: #000;
            font-size: 12px;
            font-weight: 500;
        }

        .status-badge.active {
            background: #28a745;
            color: white;
        }

        .history {
            margin-top: 20px;
        }

        .history h4 {
            margin-bottom: 10px;
        }

        .history-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .history-item .time {
            color: #666;
        }

        .history-item .value {
            font-weight: 500;
        }
    `]
})
export class DataPollingDemoComponent {
    trigger = new Subject<void>();
    latestData = signal<ServerData | null>(null);
    dataHistory = signal<ServerData[]>([]);
    isPolling = signal(false);

    startPolling() {
        this.isPolling.set(true);
        this.trigger.pipe(
            dataPolling({
                loader: () => this.fetchServerData(),
                interval: 3
            })
        ).subscribe(data => {
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
            status: Math.random() > 0.3 ? 'active' : 'idle'
        };
        return of(data).pipe(delay(500)); // Simulate network delay
    }
}
