import { Component, signal } from '@angular/core';
import { InfiniteScrollDirective } from '@ngx-oneforall/directives/infinite-scroll';

@Component({
  selector: 'infinite-scroll-demo',
  template: `
    <div class="demo-container">
      <h3>Infinite Scroll List</h3>
      <div
        class="scroll-container"
        infiniteScroll
        [scrollContainer]="'.scroll-container'"
        [useWindow]="false"
        (scrolled)="onScroll()">
        <div class="list">
          @for (item of items(); track item) {
            <div class="item">{{ item }}</div>
          }
          @if (loading()) {
            <div class="loading">Loading...</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 20px;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
      }

      .scroll-container {
        height: 300px;
        overflow-y: auto;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
        padding: 10px;
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .item {
        padding: 15px;
        background-color: var(--ng-doc-code-bg);
        border-radius: 4px;
        border: 1px solid var(--ng-doc-border-color);
      }

      .loading {
        text-align: center;
        padding: 10px;
        color: var(--ng-doc-text-muted);
        font-style: italic;
      }
    `,
  ],
  imports: [InfiniteScrollDirective],
})
export class InfiniteScrollDemoComponent {
  items = signal<string[]>(
    Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)
  );
  loading = signal<boolean>(false);
  private itemCount = 20;

  onScroll() {
    if (this.loading()) return;

    this.loading.set(true);

    // Simulate API call
    setTimeout(() => {
      const newItems = Array.from(
        { length: 10 },
        (_, i) => `Item ${this.itemCount + i + 1}`
      );
      this.items.update(current => [...current, ...newItems]);
      this.itemCount += 10;
      this.loading.set(false);
    }, 1000);
  }
}
