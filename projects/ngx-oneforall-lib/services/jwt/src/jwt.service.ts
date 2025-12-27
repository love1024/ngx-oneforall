import { base64UrlDecode } from '@ngx-oneforall/utils';
import { JwtBody, JwtOptions, tokenGetterFn } from './jwt-provider';

export class JwtService {
  private tokenGetter: tokenGetterFn;

  constructor(private readonly config?: JwtOptions) {
    this.tokenGetter = config?.tokenGetter ?? (() => '');
  }

  public decodeHeader<T = Record<string, unknown>>(
    token = this.tokenGetter()
  ): T {
    if (!token) throw new Error('Token is missing.');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token is not a valid JWT.');

    try {
      const decodedHeader = base64UrlDecode(parts[0]);
      return JSON.parse(decodedHeader) as T;
    } catch {
      throw new Error('Failed to decode JWT header.');
    }
  }

  public decodeBody<T extends JwtBody = JwtBody>(
    token = this.tokenGetter()
  ): T {
    if (!token) throw new Error('Token is missing.');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token is not a valid JWT.');

    try {
      const decodedBody = base64UrlDecode(parts[1]);
      return JSON.parse(decodedBody) as T;
    } catch {
      throw new Error('Failed to decode JWT payload.');
    }
  }

  public getClaim<T = unknown>(
    claim: string,
    token = this.tokenGetter()
  ): T | undefined {
    const body = this.decodeBody(token);
    return body[claim] as T | undefined;
  }

  public getExpirationDate(token = this.tokenGetter()): Date | null {
    const exp = this.getClaim<number>('exp', token);
    return exp ? new Date(exp * 1000) : null;
  }

  public getIssuedAtDate(token = this.tokenGetter()): Date | null {
    const iat = this.getClaim<number>('iat', token);
    return iat ? new Date(iat * 1000) : null;
  }

  public isExpired(token = this.tokenGetter(), offsetSeconds = 0): boolean {
    const exp = this.getExpirationDate(token);
    return exp ? exp.getTime() <= Date.now() + offsetSeconds * 1000 : false;
  }

  public isNotYetValid(token = this.tokenGetter()): boolean {
    const nbf = this.getClaim<number>('nbf', token);
    return nbf ? Date.now() < nbf * 1000 : false;
  }

  public getTimeUntilExpiration(token = this.tokenGetter()): number | null {
    const exp = this.getExpirationDate(token);
    return exp ? exp.getTime() - Date.now() : null;
  }

  public isValid(token = this.tokenGetter(), offsetSeconds = 0): boolean {
    return (
      !!token &&
      token.split('.').length === 3 &&
      !this.isExpired(token, offsetSeconds) &&
      !this.isNotYetValid(token)
    );
  }

  // Public functions for config access
  public getConfig() {
    return this.config;
  }

  public getToken() {
    return this.tokenGetter();
  }
}
