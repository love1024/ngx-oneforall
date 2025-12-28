import { Component } from '@angular/core';
import { HighlightSearchPipe } from '@ngx-oneforall/pipes/highlight-search';

@Component({
  selector: 'app-highlight-search-pipe-demo',
  standalone: true,
  imports: [HighlightSearchPipe],
  template: `
    <div class="demo-container">
      <h3>Basic Usage</h3>
      <p [innerHTML]="'Hello World' | highlightSearch: 'World'"></p>

      <h3>Case Insensitive</h3>
      <p [innerHTML]="'Angular is Awesome' | highlightSearch: 'angular'"></p>

      <h3>Multiple Occurrences</h3>
      <p [innerHTML]="'Banana, Apple, Banana' | highlightSearch: 'Banana'"></p>

      <h3>Special Characters</h3>
      <p [innerHTML]="'Price: $100' | highlightSearch: '$100'"></p>
    </div>
  `,
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      h3 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }
      /* Ensure mark is visible */
      :host ::ng-deep mark {
        background-color: yellow;
        color: black;
        padding: 0 2px;
        border-radius: 2px;
      }
    `,
  ],
})
export class HighlightSearchPipeDemoComponent {}
