import { Provider } from '@angular/core';
import { JwtService } from './jwt.service';

export type tokenGetterFn = () => string;

export interface JwtOptions {
  tokenGetter: tokenGetterFn;
}

export interface JwtBody {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  nbf?: number;
}

export function provideJwtService(options: JwtOptions): Provider {
  return {
    provide: JwtService,
    useValue: new JwtService(options),
  };
}
