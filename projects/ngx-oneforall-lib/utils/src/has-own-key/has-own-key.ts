export function hasOwnKey<T extends object>(
  obj: T,
  key: keyof T
): key is keyof T {
  return key in obj;
}
