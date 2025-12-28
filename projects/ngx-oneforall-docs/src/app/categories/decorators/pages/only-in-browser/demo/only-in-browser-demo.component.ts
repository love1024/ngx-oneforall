import { Component, signal } from '@angular/core';
import { OnlyInBrowser } from '@ngx-oneforall/decorators/only-in-browser';

@Component({
  selector: 'lib-only-in-browser-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h2>OnlyInBrowser Decorator</h2>
      <p>
        <strong>Current URL:</strong> <br />
        <span class="url">{{ currentUrl() || 'Not available (SSR)' }}</span>
      </p>
      <small>
        <em>
          The URL is only extracted in the browser. On server-side rendering, it
          will be empty.
        </em>
      </small>
    </div>
  `,
  styleUrl: 'only-in-browser-demo.component.scss',
})
export class OnlyInBrowserDemoComponent {
  currentUrl = signal<string>('');

  constructor() {
    this.extractUrl();
  }

  @OnlyInBrowser()
  extractUrl() {
    // Only runs in browser
    this.currentUrl.set(window.location.href);
  }
}
