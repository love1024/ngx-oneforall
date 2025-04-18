export function hashCode(str: string): number {
  return str.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);

    return a & a;
  }, 0);
}

export function hashCodeWithSalt(str: string, salt: string): number {
  return str.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);

    return a & a;
  }, hashCode(salt));
}
