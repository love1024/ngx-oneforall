import { Component } from '@angular/core';
import { LogExecutionTime } from '@ngx-oneforall/decorators';

@Component({
  selector: 'lib-log-execution-time-demo',
  template: `
    <div class="demo-container">
      <h2>Log Execution Time Demo</h2>
      <p>
        Click a button to measure the execution time of the corresponding method
        <strong>(check in your browser's console)</strong>:
      </p>
      <button (click)="runSync()">Run Synchronous Method</button>
      <button (click)="runAsync()">Run Asynchronous Method</button>
    </div>
  `,
  styleUrls: ['log-execution-time-demo.component.scss'],
})
export class LogExecutionTimeDemoComponent {
  @LogExecutionTime('SyncMethod')
  runSync() {
    // Simulate some work
    for (let i = 0; i < 1e6; i++) {
      // Empty
    }
  }

  @LogExecutionTime('AsyncMethod')
  async runAsync() {
    // Simulate async work
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
