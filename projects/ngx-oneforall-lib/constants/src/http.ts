export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export const HTTP_HEADER = {
  Authorization: 'Authorization',
  ContentType: 'Content-Type',
  Accept: 'Accept',
  CacheControl: 'Cache-Control',
  IfNoneMatch: 'If-None-Match',
} as const;
