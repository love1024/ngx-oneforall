import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface EncryptionContextConfig {
  enabled?: boolean;
  encryptRequest?: boolean;
  decryptResponse?: boolean;
  context?: HttpContext;
}

export const ENCRYPTION_CONTEXT = new HttpContextToken<EncryptionContextConfig>(
  () => ({})
);

export function useEncryption(options: EncryptionContextConfig = {}) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(ENCRYPTION_CONTEXT, {
    enabled: true,
    encryptRequest: true,
    decryptResponse: true,
    ...restOptions,
  });
}
