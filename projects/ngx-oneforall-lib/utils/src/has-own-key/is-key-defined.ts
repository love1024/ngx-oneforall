export function isKeyDefined<T extends object>(
  obj: T,
  key: keyof T,
  ownPropertyOnly = true
): boolean {
  if (ownPropertyOnly) {
    return (
      Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined
    );
  }
  return key in obj && obj[key] !== undefined;
}
