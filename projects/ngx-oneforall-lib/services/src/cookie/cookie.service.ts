import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  get(name: string): string {
    name = encodeURIComponent(name);
    const regExp = this.getCookieUsingRegex(name);
    const result = regExp.exec(document.cookie);
    return result?.[1] ? this.safeDecodeURIComponent(result[1]) : '';
  }

  getAll(): Record<string, string> {
    return Object.fromEntries(
      document.cookie.split(';').map(cookie => {
        const [name, ...rest] = cookie.split('=');
        // Join with '=', If the split was doine from '=' in value as well
        const value = rest.join('=');
        return [
          this.safeDecodeURIComponent(name.trim()),
          this.safeDecodeURIComponent(value),
        ];
      })
    );
  }

  private getCookieUsingRegex(name: string): RegExp {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|;\\s*)${escapedName}=(.*?)(?:;|$)`);
  }

  private safeDecodeURIComponent(encodedString: string): string {
    try {
      return decodeURIComponent(encodedString);
    } catch {
      return encodedString;
    }
  }
}
