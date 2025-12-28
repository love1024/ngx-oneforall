import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * Context token to skip the JWT interceptor (both token attachment and refresh logic).
 * Useful for login or refresh token requests.
 */
export const SKIP_JWT_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

/**
 * Helper function to set the SKIP_JWT_INTERCEPTOR context.
 *
 * @param context The optional existing HttpContext.
 * @returns The HttpContext with SKIP_JWT_INTERCEPTOR set to true.
 */
export function withSkipJwtInterceptor(context?: HttpContext) {
  return (context ?? new HttpContext()).set(SKIP_JWT_INTERCEPTOR, true);
}
