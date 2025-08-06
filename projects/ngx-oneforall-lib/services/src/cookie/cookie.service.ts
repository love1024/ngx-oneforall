import { Injectable } from '@angular/core';

export type SameSiteOption = 'Strict' | 'Lax' | 'None';

export interface CookieOptions {
  sameSite?: SameSiteOption;
  domain?: string;
  path?: string;
  secure?: boolean;
}

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

  set(name: string, value: string, options?: CookieOptions) {
    const mergedOptions = this.mergeDefaultCookieOptions(options);
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;

    cookieString += `sameSite=${mergedOptions.sameSite};`;

    if (mergedOptions?.path) {
      cookieString += `path=${mergedOptions.path};`;
    }
    if (mergedOptions?.domain) {
      cookieString += `domain=${mergedOptions.domain};`;
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#security
    if (mergedOptions?.secure === false && mergedOptions.sameSite === 'None') {
      mergedOptions.secure = true;
      console.warn(
        '[ngx-oneforall] - Cookie Service: Setting secure flag. As per Mozilla security document, if SameSite=None is set then the Secure attribute must also be set.'
      );
    }

    if (mergedOptions?.secure) {
      cookieString += `secure;`;
    }

    document.cookie = cookieString;
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

  private mergeDefaultCookieOptions(options?: CookieOptions): CookieOptions {
    return {
      sameSite: options?.sameSite ?? 'Lax',
      ...options,
    } satisfies CookieOptions;
  }
}
