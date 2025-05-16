import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { backOffRetry } from '@ngx-oneforall/rxjs';
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

      if (this.subscriptionCount() <= 3) {
        this.retryMessages.update(messages => [
          ...messages,
          `Fetching Failed, Retrying after ${Math.pow(2, this.subscriptionCount())} seconds`,
        ]);
        observer.error('Error occurred');
      } else {
        observer.next('Data fetched successfully');
        observer.complete();
      }
    });
  }
}
