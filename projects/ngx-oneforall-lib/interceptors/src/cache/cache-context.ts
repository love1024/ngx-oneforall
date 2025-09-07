import { HttpContext, HttpContextToken } from '@angular/common/http';

export const CACHE_CONTEXT = new HttpContextToken<boolean>(() => true);

export function cache() {
  return new HttpContext().set(CACHE_CONTEXT, true);
}
