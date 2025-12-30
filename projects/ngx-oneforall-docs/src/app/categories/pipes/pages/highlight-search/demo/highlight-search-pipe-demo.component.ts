import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightSearchPipe } from 'ngx-oneforall/pipes/highlight-search';

@Component({
  selector: 'app-highlight-search-pipe-demo',
  imports: [HighlightSearchPipe, FormsModule],
  template: `
    <div class="demo-container">
      <h3>Interactive Demo</h3>
      <div class="input-group">
        <label for="search">Search term:</label>
        <input
          id="search"
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Type to highlight..." />
      </div>
      <p [innerHTML]="sampleText | highlightSearch: searchTerm"></p>

      <h3>Case Insensitive</h3>
      <p [innerHTML]="'Angular is Awesome' | highlightSearch: 'angular'"></p>

      <h3>Custom Tag (span)</h3>
      <p [innerHTML]="'Hello World' | highlightSearch: 'World' : 'span'"></p>

      <h3>Custom CSS Class</h3>
      <p
        [innerHTML]="
          'Hello World' | highlightSearch: 'World' : 'span' : 'custom-highlight'
        "></p>

      <h3>Special Characters</h3>
      <p [innerHTML]="'Price: $100' | highlightSearch: '$100'"></p>
    </div>
  `,
  styleUrl: './highlight-search-pipe-demo.component.scss',
})
export class HighlightSearchPipeDemoComponent {
  searchTerm = 'Angular';
  sampleText =
    'Angular is a platform for building mobile and desktop web applications. Angular makes development easy.';
}
