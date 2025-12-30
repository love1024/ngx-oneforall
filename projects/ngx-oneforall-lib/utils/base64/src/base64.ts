/**
 * Converts a File object to a base64-encoded data URL string.
 *
 * @param file - The File object to convert.
 * @returns A Promise that resolves to the base64 data URL (e.g., `data:image/png;base64,...`).
 *
 * @example
 * const file = event.target.files[0];
 * const dataUrl = await fileToBase64(file);
 * // dataUrl: "data:image/png;base64,iVBORw0KGgo..."
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });

/**
 * Encodes a UTF-8 string to standard base64.
 * Handles multi-byte Unicode characters correctly.
 *
 * @param value - The string to encode.
 * @returns The base64-encoded string.
 *
 * @example
 * base64Encode('Hello, 世界!'); // "SGVsbG8sIOS4lueVjCE="
 */
export const base64Encode = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

/**
 * Decodes a standard base64 string to a UTF-8 string.
 * Handles multi-byte Unicode characters correctly.
 *
 * @param value - The base64-encoded string to decode.
 * @returns The decoded UTF-8 string.
 * @throws Error if the input is not valid base64.
 *
 * @example
 * base64Decode('SGVsbG8sIOS4lueVjCE='); // "Hello, 世界!"
 */
export const base64Decode = (value: string): string => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/**
 * Encodes a UTF-8 string to URL-safe base64 (RFC 4648).
 * Replaces `+` with `-`, `/` with `_`, and removes padding `=`.
 *
 * @param value - The string to encode.
 * @returns The URL-safe base64-encoded string.
 *
 * @example
 * base64UrlEncode('Hello, 世界!'); // "SGVsbG8sIOS4lueVjCE"
 */
export const base64UrlEncode = (value: string): string => {
  return base64Encode(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Decodes a URL-safe base64 string (RFC 4648) to a UTF-8 string.
 * Handles missing padding automatically.
 *
 * @param value - The URL-safe base64-encoded string to decode.
 * @returns The decoded UTF-8 string.
 * @throws Error if the input is not valid base64.
 *
 * @example
 * base64UrlDecode('SGVsbG8sIOS4lueVjCE'); // "Hello, 世界!"
 */
export const base64UrlDecode = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '='
  );
  return base64Decode(padded);
};
