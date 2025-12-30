import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { backOffRetry } from 'ngx-oneforall/rxjs/backoff-retry';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-backoff-retry-demo',
  imports: [AsyncPipe],
  template: `
    <h2>Backoff Retry Demo</h2>

    @if (fetchData()) {
      @for (message of retryMessages(); track message) {
        <p class="failed-message">{{ message }}</p>
      }
      @if (data | async; as result) {
        <p class="success-message">{{ result }}</p>
      }
    } @else {
      <button (click)="fetchData.set(true)">Fetch Data</button>
    }
  `,
  styleUrls: ['./backoff-retry-demo.component.scss'],
})
export class BackoffRetryDemoComponent implements OnInit {
  data?: Observable<string>;

  // The messages to be displayed when the data fetching fails.
  retryMessages = signal<string[]>([]);

  // The number of times the data fetching has been retried.
  subscriptionCount = signal(0);

  // A signal to indicate whether to fetch data or not.
  fetchData = signal(false);

  ngOnInit() {
    this.data = this.getData().pipe(backOffRetry());
  }

  /**
   * This is a mock function to simulate data fetching.
   * @returns Observable<string>
   */
  private getData() {
    return new Observable<string>(observer => {
      this.subscriptionCount.update(count => count + 1);
      const count = this.subscriptionCount();

      // Subscription 1: Initial (fails)
      // Subscription 2: Retry 1 (fails) - delayed by 1s
      // Subscription 3: Retry 2 (fails) - delayed by 2s
      // Subscription 4: Retry 3 (fails) - delayed by 4s
      // Total 4 attempts (1 initial + 3 retries)

      if (count <= 4) {
        // Calculate delay for the NEXT retry
        // If current is count=4 (3rd retry), next would be count=5 (which wont happen in this demo limit)
        // But for display, we show what delay JUST happened or will happen
        const retryCount = count - 1; // 0 for initial
        const delay = 1000 * Math.pow(2, retryCount - 1); // 1000 * 2^(0) = 1000

        if (count > 1) {
          // We are in a retry
          this.retryMessages.update(messages => [
            ...messages,
            `Retry #${retryCount} - Waited ${delay}ms`,
          ]);
        } else {
          this.retryMessages.update(messages => [
            ...messages,
            `Initial Request Failed`,
          ]);
        }

        observer.error('Error occurred');
      } else {
        observer.next('Data fetched successfully');
        observer.complete();
      }
    });
  }
}
