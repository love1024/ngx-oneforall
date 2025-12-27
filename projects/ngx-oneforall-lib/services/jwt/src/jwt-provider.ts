import { Observable } from 'rxjs';
import { Provider } from '@angular/core';
import { JwtService } from './jwt.service';

/**
 * Interface for handling token refresh and logout logic.
 * This is used by the jwtInterceptor when a 401 Unauthorized error occurs.
 */
export interface RefreshTokenHandler {
  /**
   * Logic to refresh the token. Should return an Observable with the new token.
   */
  refreshToken(): Observable<string>;

  /**
   * Logic to logout the user if refresh fails or is not possible.
   */
  logout(): void;
}

export type tokenGetterFn = () => string | null;

export interface JwtOptions {
  tokenGetter?: tokenGetterFn;
  authScheme?: string;
  errorOnNoToken?: boolean;
  skipAddingIfExpired?: boolean;
  headerName?: string;
  allowedDomains?: (string | RegExp)[];
  skipUrls?: (string | RegExp)[];
  /**
   * Optional handler for automatic token refresh on 401 errors.
   */
  refreshTokenHandler?: RefreshTokenHandler;
}

export interface JwtBody {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  nbf?: number;
}

export function provideJwtService(options?: JwtOptions): Provider {
  return {
    provide: JwtService,
    useValue: new JwtService(options),
  };
}
