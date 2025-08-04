import { Provider } from '@angular/core';
import { CookieService } from './cookie.service';

export function provideCookieService(): Provider {
  return CookieService;
}
