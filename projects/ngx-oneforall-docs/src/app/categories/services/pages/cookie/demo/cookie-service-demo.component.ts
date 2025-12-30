import { Component, signal } from '@angular/core';
import {
  CookieService,
  provideCookieService,
} from 'ngx-oneforall/services/cookie';

@Component({
  selector: 'lib-cookie-service-demo',
  template: `
    <div class="cookie-demo-container">
      <h2>Cookie Service Demo</h2>
      <p>
        Set a cookie in browser for 60 seconds. Try to get it back after
        refreshing the screen to see it persisted.
      </p>
      <button (click)="setCookie()">Set Cookie</button>
      <button (click)="getCookie()">Get Cookie</button>
      <button (click)="deleteCookie()">Delete Cookie</button>
      <br />
      @if (cookieValue !== null) {
        Cookie Value: <strong>{{ cookieValue() }}</strong>
      }
    </div>
  `,
  styleUrl: 'cookie-service-demo.component.scss',
  providers: [provideCookieService()],
})
export class CookieServiceDemoComponent {
  cookieValue = signal<string | null>(null);

  constructor(private cookieService: CookieService) {}

  setCookie() {
    this.cookieService.set('demoCookie', 'Hello, Cookie!', { expires: 60 });
    this.cookieValue.set('Hello, Cookie!');
  }

  getCookie() {
    this.cookieValue.set(this.cookieService.get('demoCookie'));
  }

  deleteCookie() {
    this.cookieService.delete('demoCookie');
    this.cookieValue.set(null);
  }
}
