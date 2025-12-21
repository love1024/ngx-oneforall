import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import {
  ENCRYPTION_CONTEXT,
  EncryptionContextConfig,
} from './encryption-context';
import { map } from 'rxjs/operators';

export interface EncryptionInterceptorConfig {
  enabled?: boolean;
  headerName?: string;
  adapter: EncryptionAdapter;
}

export interface EncryptionAdapter {
  encrypt(data: unknown): unknown;
  decrypt(data: unknown): unknown;
}

export const withEncryptionInterceptor = (
  config: EncryptionInterceptorConfig
) => {
  const { enabled = true, headerName = 'X-Encrypted-Data', adapter } = config;

  if (!adapter) {
    throw new Error(
      '[NgxOneforall - EncryptionInterceptor]: Encryption adapter is required'
    );
  }

  const encryptionInterceptor: HttpInterceptorFn = (request, next) => {
    const contextConfig: EncryptionContextConfig | null =
      request.context.get(ENCRYPTION_CONTEXT);

    if (contextConfig?.enabled === false || !enabled) {
      return next(request);
    }

    let encryptedRequest = request;
    const encryptRequest = contextConfig?.encryptRequest ?? true;
    const decryptResponse = contextConfig?.decryptResponse ?? true;

    if (encryptRequest && request.body != null) {
      encryptedRequest = request.clone({
        body: adapter.encrypt(request.body),
        setHeaders: {
          [headerName]: '1',
        },
      });
    }

    return next(encryptedRequest).pipe(
      map(event => {
        if (
          decryptResponse &&
          event instanceof HttpResponse &&
          event.body != null
        ) {
          return event.clone({
            body: adapter.decrypt(event.body),
          });
        }
        return event;
      })
    );
  };

  return encryptionInterceptor;
};
