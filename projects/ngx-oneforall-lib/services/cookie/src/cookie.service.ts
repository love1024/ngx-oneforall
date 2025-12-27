import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SameSiteOption = 'Strict' | 'Lax' | 'None';

const deleteDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');

export interface CookieOptions {
  sameSite?: SameSiteOption;
  domain?: string;
  path?: string;
  secure?: boolean;
  partitioned?: boolean;
  // Date or the number of seconds after which cookie expires
  expires?: number | Date;
}

@Injectable()
export class CookieService {
  private platformId = inject(PLATFORM_ID);

  get(name: string): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    name = encodeURIComponent(name);
    const regExp = this.getCookieUsingRegex(name);
    const result = regExp.exec(document.cookie);
    return result?.[1] ? this.safeDecodeURIComponent(result[1]) : '';
  }

  getAll(): Record<string, string> {
    if (!isPlatformBrowser(this.platformId)) return {};
    return Object.fromEntries(
      document.cookie.split(';').map(cookie => {
        const [name, ...rest] = cookie.split('=');
        // Join with '=', If the split was done from '=' in value as well
        const value = rest.join('=');
        return [
          this.safeDecodeURIComponent(name.trim()),
          this.safeDecodeURIComponent(value),
        ];
      })
    );
  }

  set(name: string, value: string, options?: CookieOptions) {
    if (!isPlatformBrowser(this.platformId)) return;
    const mergedOptions = this.mergeDefaultCookieOptions(options);
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;

    cookieString += `sameSite=${mergedOptions.sameSite};`;

    if (mergedOptions?.path) {
      cookieString += `path=${mergedOptions.path};`;
    }
    if (mergedOptions?.domain) {
      cookieString += `domain=${mergedOptions.domain};`;
    }
    if (mergedOptions?.partitioned) {
      cookieString += `partitioned;`;
    }
    if (mergedOptions?.expires) {
      cookieString += `expires=${this.getExpiryTime(mergedOptions.expires)}`;
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#security
    if (mergedOptions?.secure === false && mergedOptions.sameSite === 'None') {
      mergedOptions.secure = true;
      console.warn(
        `[ngx-oneforall: Cookie Service] - Setting secure flag for ${name}. As per Mozilla security document, if SameSite=None is set then the Secure attribute must also be set.`
      );
    }

    if (mergedOptions?.secure) {
      cookieString += `secure;`;
    }

    document.cookie = cookieString;
  }

  delete(name: string, options?: CookieOptions) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.set(name, '', { path: '/', ...options, expires: deleteDate });
  }

  deleteAll(options?: CookieOptions) {
    const cookies = this.getAll();

    Object.keys(cookies).forEach(name => {
      this.delete(name, options);
    });
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

  private getExpiryTime(expires: number | Date) {
    if (typeof expires === 'number') {
      expires = new Date(new Date().getTime() + expires * 1000);
    }

    return expires.toUTCString();
  }

  private mergeDefaultCookieOptions(options?: CookieOptions): CookieOptions {
    return {
      sameSite: options?.sameSite ?? 'Lax',
      ...options,
    } satisfies CookieOptions;
  }
}
