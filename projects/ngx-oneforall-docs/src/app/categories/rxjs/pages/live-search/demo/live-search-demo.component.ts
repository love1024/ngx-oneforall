import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { liveSearch } from '@ngx-oneforall/rxjs/live-search';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-live-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="demo-container">
      <h3>Live Search Demo</h3>
      <p>Search with debounce and auto-cancellation</p>

      <div class="search-box">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Search for items..."
          class="search-input" />
        @if (isSearching()) {
          <span class="loading-icon">⏳</span>
        } @else {
          <span class="search-icon">🔍</span>
        }
      </div>

      @if (searchControl.value) {
        <div class="search-info">
          <small>Searching for: "{{ searchControl.value }}"</small>
        </div>
      }

      @if (results().length > 0) {
        <div class="results">
          <h4>Results ({{ results().length }}):</h4>
          @for (result of results(); track $index) {
            <div class="result-item">
              <div class="result-title">{{ result.title }}</div>
              <div class="result-description">{{ result.description }}</div>
            </div>
          }
        </div>
      }

      @if (searchControl.value && results().length === 0 && !isSearching()) {
        <div class="no-results">
          <p>No results found for "{{ searchControl.value }}"</p>
        </div>
      }

      <div class="info-box">
        <h4>Features:</h4>
        <ul>
          <li>✅ Debounces input (300ms delay)</li>
          <li>✅ Filters duplicate searches</li>
          <li>✅ Cancels previous requests</li>
          <li>✅ Simulated API delay (500ms)</li>
        </ul>
      </div>
    </div>
  `,
  styleUrl: './live-search-demo.component.scss',
})
export class LiveSearchDemoComponent {
  searchControl = new FormControl<string>('', { nonNullable: true });
  results = signal<SearchResult[]>([]);
  isSearching = signal(false);

  private mockData: SearchResult[] = [
    {
      id: 1,
      title: 'Angular',
      description: 'A platform for building web applications',
    },
    {
      id: 2,
      title: 'React',
      description: 'A JavaScript library for building user interfaces',
    },
    {
      id: 3,
      title: 'Vue',
      description: 'The Progressive JavaScript Framework',
    },
    {
      id: 4,
      title: 'TypeScript',
      description: 'JavaScript with syntax for types',
    },
    { id: 5, title: 'RxJS', description: 'Reactive Extensions for JavaScript' },
    { id: 6, title: 'NgRx', description: 'Reactive State for Angular' },
    {
      id: 7,
      title: 'Angular Material',
      description: 'Material Design components for Angular',
    },
    {
      id: 8,
      title: 'Tailwind CSS',
      description: 'A utility-first CSS framework',
    },
  ];

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        tap(() => this.isSearching.set(true)),
        liveSearch(300, query => this.searchData(query))
      )
      .subscribe(results => {
        this.results.set(results);
        this.isSearching.set(false);
      });
  }

  private searchData(query: string) {
    if (!query.trim()) {
      return of([]);
    }

    const filtered = this.mockData.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate API delay
    return of(filtered).pipe(delay(500));
  }
}
